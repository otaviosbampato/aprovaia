from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
import json
import re
import os
from typing import Dict, Any
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Inicializar FastAPI
app = FastAPI(
    title="API de Correção de Redações ENEM",
    description="API para correção automática de redações do ENEM usando IA",
    version="1.0.0"
)

# Configurar CORS (necessário para o frontend acessar a API no navegador)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, restrinja para os domínios do frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from dotenv import load_dotenv
load_dotenv()

# Inicializar cliente Groq
# Certifique-se de definir a variável de ambiente GROQ_API_KEY
groq_client = Groq(
    api_key=os.environ.get("GROQ_API_KEY")
)

# Modelos de dados
class RedacaoRequest(BaseModel):
    texto: str
    tema: str = ""

class CompetenciaAvaliacao(BaseModel):
    nota: int
    feedback: str
    pontos_fortes: str
    pontos_fracos: str
    sugestoes: str

class RedacaoResponse(BaseModel):
    nota_geral: int
    competencias: Dict[str, CompetenciaAvaliacao]
    observacoes_gerais: str
    tempo_processamento: float

def criar_prompt_correcao(texto: str, tema: str = "") -> str:
    """
    Cria o prompt para correção da redação do ENEM
    """
    tema_info = f"\n--- Tema da redação ---\n{tema}\n" if tema else ""
    
    prompt = f"""
Você é um avaliador oficial do ENEM com formação em Letras ou Linguística, seguindo rigorosamente a Matriz de Referência para Redação 2024. Avalie a redação de forma independente, considerando que ela será corrigida por outro avaliador e a nota final será a média entre as duas avaliações.

CRITÉRIOS DE ANULAÇÃO (NOTA 0 TOTAL):
Verifique primeiro se a redação deve ser anulada por:
- Fuga total ao tema
- Não atendimento ao tipo dissertativo-argumentativo
- Texto com até 7 linhas manuscritas (ou 10 no Braille)
- Impropérios, desenhos ou formas de identificação
- Parte deliberadamente desconectada do tema
- Texto predominantemente em língua estrangeira
- Cópia integral de textos motivadores

{tema_info}

COMPETÊNCIAS - AVALIE RIGOROSAMENTE CONFORME A MATRIZ OFICIAL:

*COMPETÊNCIA I - DOMÍNIO DA MODALIDADE ESCRITA FORMAL (0-200 pontos)*

Critérios de Avaliação:
- Convenções da escrita: acentuação, ortografia, hífen, maiúsculas/minúsculas, separação silábica
- Aspectos gramaticais: regência verbal/nominal, concordância verbal/nominal, tempos/modos verbais, pontuação, paralelismo, pronomes, crase
- Escolha de registro: adequação à modalidade formal, ausência de marcas de oralidade
- Escolha vocabular: precisão e adequação ao contexto
- Estrutura sintática: períodos bem estruturados, complexidade adequada, ausência de truncamentos

Níveis:
* 200 pontos: Excelente domínio, desvios aceitos apenas como excepcionalidade sem reincidência
* 160 pontos: Bom domínio com poucos desvios
* 120 pontos: Domínio mediano com alguns desvios
* 80 pontos: Domínio insuficiente com muitos desvios
* 40 pontos: Domínio precário com desvios sistemáticos e diversificados
* 0 pontos: Desconhecimento da modalidade formal

*COMPETÊNCIA II - COMPREENSÃO DA PROPOSTA E TIPO TEXTUAL (0-200 pontos)*

Critérios de Avaliação:
- Compreensão completa da proposta de redação
- Desenvolvimento do tema dentro dos limites estruturais do texto dissertativo-argumentativo
- Presença e produtividade do repertório sociocultural
- Manutenção do foco temático (evitar tangenciamento)
- Defesa clara de um ponto de vista com argumentação

ATENÇÃO: Tangenciamento afeta também as Competências III e V (máximo 40 pontos em cada).

Níveis:
* 200 pontos: Argumentação consistente com repertório sociocultural produtivo, excelente domínio dissertativo-argumentativo
* 160 pontos: Argumentação consistente, bom domínio com proposição, argumentação e conclusão
* 120 pontos: Argumentação previsível, domínio mediano com estrutura adequada
* 80 pontos: Cópia de trechos motivadores ou domínio insuficiente da estrutura
* 40 pontos: Tangenciamento ao tema ou domínio precário com traços de outros tipos textuais
* 0 pontos: Fuga ao tema ou não atendimento à estrutura dissertativo-argumentativa

*COMPETÊNCIA III - ORGANIZAÇÃO E ARGUMENTAÇÃO (0-200 pontos)*

Critérios de Avaliação:
- Presença de projeto de texto perceptível
- Seleção pertinente de argumentos para defesa do ponto de vista
- Articulação e organização das informações
- Desenvolvimento adequado dos argumentos (não apenas mencioná-los)
- Progressão textual coerente
- Ausência de contradições
- Indícios de autoria

Níveis:
* 200 pontos: Informações consistentes e organizadas, configurando autoria em defesa do ponto de vista
* 160 pontos: Informações organizadas com indícios de autoria
* 120 pontos: Informações limitadas aos textos motivadores, pouco organizadas
* 80 pontos: Informações desorganizadas ou contraditórias, limitadas aos motivadores
* 40 pontos: Informações pouco relacionadas ao tema, incoerentes, sem defesa de ponto de vista
* 0 pontos: Informações não relacionadas ao tema, sem defesa de ponto de vista

*COMPETÊNCIA IV - MECANISMOS LINGUÍSTICOS DE ARGUMENTAÇÃO (0-200 pontos)*

Critérios de Avaliação:
- Articulação adequada entre parágrafos
- Estruturação lógica dos períodos
- Repertório diversificado de recursos coesivos
- Referenciação adequada (pronomes, sinônimos, expressões resumitivas)
- Uso correto de operadores argumentativos
- Ausência de paragrafação inadequada

Níveis:
* 200 pontos: Articula bem as partes com repertório diversificado de recursos coesivos
* 160 pontos: Articula as partes com poucas inadequações e repertório diversificado
* 120 pontos: Articulação mediana com inadequações e repertório pouco diversificado
* 80 pontos: Articulação insuficiente com muitas inadequações e repertório limitado
* 40 pontos: Articulação precária
* 0 pontos: Não articula as informações

*COMPETÊNCIA V - PROPOSTA DE INTERVENÇÃO (0-200 pontos)*

Critérios de Avaliação:
- Presença de proposta clara e explícita
- Detalhamento completo: O QUE (ação), QUEM (agente), COMO (meio), PARA QUE (finalidade), DETALHAMENTO adicional
- Articulação com a argumentação desenvolvida
- Especificidade ao tema (não apenas ao assunto geral)
- Respeito aos direitos humanos
- Viabilidade da proposta

DESRESPEITO AOS DIREITOS HUMANOS:
- Defesa de tortura, mutilação, execução sumária, "justiça com as próprias mãos"
- Incitação à violência por questões de raça, etnia, gênero, credo, condição física
- Qualquer forma de discurso de ódio
- Violação dos princípios: dignidade humana, igualdade, valorização das diferenças, laicidade, democracia, sustentabilidade

Níveis:
* 200 pontos: Proposta muito bem elaborada, detalhada, relacionada ao tema e articulada
* 160 pontos: Proposta bem elaborada, relacionada e articulada
* 120 pontos: Proposta mediana, relacionada e articulada
* 80 pontos: Proposta insuficiente, relacionada ao tema mas pouco articulada
* 40 pontos: Proposta vaga, precária ou relacionada apenas ao assunto
* 0 pontos: Ausência de proposta ou proposta não relacionada ao tema

FORMATO OBRIGATÓRIO - RESPONDA APENAS EM JSON:

{{
    "nota_geral": [soma das 5 competências],
    "competencia_1": {{
        "nota": [0, 40, 80, 120, 160 ou 200],
        "feedback": "Análise específica com exemplos do texto, identificando desvios concretos",
        "pontos_fortes": "Aspectos positivos observados",
        "pontos_fracos": "Problemas identificados com exemplos",
        "sugestoes": "Orientações específicas para melhoria"
    }},
    "competencia_2": {{
        "nota": [0, 40, 80, 120, 160 ou 200],
        "feedback": "Análise da compreensão do tema, tipo textual e repertório",
        "pontos_fortes": "Aspectos positivos observados",
        "pontos_fracos": "Problemas de compreensão ou estrutura",
        "sugestoes": "Orientações para melhor desenvolvimento temático"
    }},
    "competencia_3": {{
        "nota": [0, 40, 80, 120, 160 ou 200],
        "feedback": "Análise do projeto de texto, argumentação e organização",
        "pontos_fortes": "Qualidades argumentativas identificadas",
        "pontos_fracos": "Problemas de coerência ou desenvolvimento",
        "sugestoes": "Orientações para melhor organização textual"
    }},
    "competencia_4": {{
        "nota": [0, 40, 80, 120, 160 ou 200],
        "feedback": "Análise da articulação textual e recursos coesivos",
        "pontos_fortes": "Recursos coesivos bem empregados",
        "pontos_fracos": "Problemas de articulação identificados",
        "sugestoes": "Orientações para melhor coesão textual"
    }},
    "competencia_5": {{
        "nota": [0, 40, 80, 120, 160 ou 200],
        "feedback": "Análise da proposta de intervenção e detalhamento",
        "pontos_fortes": "Aspectos positivos da proposta",
        "pontos_fracos": "Ausências ou inadequações na proposta",
        "sugestoes": "Orientações para proposta mais completa"
    }},
    "observacoes_gerais": "Síntese da avaliação considerando o perfil de um concluinte do Ensino Médio"
}}

--- REDAÇÃO A SER AVALIADA ---
{texto}

IMPORTANTE: Avalie com o rigor de um corretor oficial do ENEM. Use apenas as notas: 0, 40, 80, 120, 160 ou 200 pontos para cada competência. Responda APENAS com o JSON válido.
"""
    
    return prompt

def extrair_json_da_resposta(resposta: str) -> Dict[str, Any]:
    """
    Extrai e valida o JSON da resposta do modelo
    """
    try:
        # Tentar extrair JSON da resposta
        resposta = resposta.strip()
        
        # Se a resposta não começar com {, procurar pelo primeiro {
        inicio_json = resposta.find('{')
        if inicio_json != -1:
            resposta = resposta[inicio_json:]
        
        # Se a resposta não terminar com }, procurar pelo último }
        fim_json = resposta.rfind('}')
        if fim_json != -1:
            resposta = resposta[:fim_json + 1]
        
        # Tentar parsear o JSON
        resultado = json.loads(resposta)
        
        # Validar estrutura básica
        if not all(key in resultado for key in ['nota_geral', 'competencia_1', 'competencia_2', 'competencia_3', 'competencia_4', 'competencia_5']):
            raise ValueError("JSON não contém todas as competências necessárias")
        
        return resultado
        
    except json.JSONDecodeError as e:
        logger.error(f"Erro ao parsear JSON: {e}")
        logger.error(f"Resposta recebida: {resposta[:500]}...")
        raise HTTPException(status_code=500, detail="Erro ao processar resposta da IA")
    except Exception as e:
        logger.error(f"Erro inesperado ao processar resposta: {e}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")

def validar_notas(avaliacao: Dict[str, Any]) -> Dict[str, Any]:
    """
    Valida e corrige as notas se necessário
    """
    # Validar nota geral
    if not isinstance(avaliacao['nota_geral'], int) or not (0 <= avaliacao['nota_geral'] <= 1000):
        avaliacao['nota_geral'] = max(0, min(1000, avaliacao['nota_geral']))
    
    # Validar notas das competências
    soma_competencias = 0
    for i in range(1, 6):
        comp_key = f'competencia_{i}'
        if comp_key in avaliacao and 'nota' in avaliacao[comp_key]:
            nota = avaliacao[comp_key]['nota']
            if not isinstance(nota, int) or not (0 <= nota <= 200):
                avaliacao[comp_key]['nota'] = max(0, min(200, nota))
            soma_competencias += avaliacao[comp_key]['nota']
    
    # Ajustar nota geral se necessário
    if abs(avaliacao['nota_geral'] - soma_competencias) > 50:
        avaliacao['nota_geral'] = soma_competencias
    
    return avaliacao

def chamar_groq_api(prompt: str) -> str:
    """
    Chama a API do Groq para análise da redação
    """
    try:
        response = groq_client.chat.completions.create(
            model="qwen/qwen3-32b",  # ou outro modelo disponível
            messages=[
                {
                    "role": "system", 
                    "content": "Você é um especialista em correção de redações do ENEM. Responda sempre no formato JSON solicitado, sendo preciso e construtivo em suas avaliações."
                },
                {
                    "role": "user", 
                    "content": prompt
                }
            ],
            temperature=0.3,  # Baixa temperatura para respostas mais consistentes
            max_tokens=4000,
            top_p=0.9
        )
        
        return response.choices[0].message.content
        
    except Exception as e:
        logger.error(f"Erro ao chamar API Groq: {e}")
        raise HTTPException(status_code=500, detail="Erro ao conectar com serviço de IA")

@app.post("/corrigir-redacao", response_model=RedacaoResponse)
async def corrigir_redacao(request: RedacaoRequest):
    """
    Endpoint principal para correção de redações do ENEM
    """
    import time
    inicio = time.time()
    
    try:
        # Validações básicas
        if not request.texto or len(request.texto.strip()) < 50:
            raise HTTPException(status_code=400, detail="Texto da redação muito curto (mínimo 50 caracteres)")
        
        if len(request.texto) > 10000:
            raise HTTPException(status_code=400, detail="Texto da redação muito longo (máximo 10.000 caracteres)")
        
        # Criar prompt
        prompt = criar_prompt_correcao(request.texto, request.tema)
        
        # Chamar API Groq
        logger.info("Enviando redação para análise...")
        resposta_ia = chamar_groq_api(prompt)
        
        # Processar resposta
        avaliacao = extrair_json_da_resposta(resposta_ia)
        avaliacao = validar_notas(avaliacao)
        
        # Calcular tempo de processamento
        tempo_processamento = round(time.time() - inicio, 2)
        
        # Montar resposta
        competencias = {}
        for i in range(1, 6):
            comp_key = f'competencia_{i}'
            comp_data = avaliacao[comp_key]
            competencias[f"Competência {i}"] = CompetenciaAvaliacao(
                nota=comp_data['nota'],
                feedback=comp_data['feedback'],
                pontos_fortes=comp_data.get('pontos_fortes', 'Não especificado'),
                pontos_fracos=comp_data.get('pontos_fracos', 'Não especificado'),
                sugestoes=comp_data.get('sugestoes', 'Não especificado')
            )
        
        logger.info(f"Redação corrigida com sucesso. Nota: {avaliacao['nota_geral']}")
        
        return RedacaoResponse(
            nota_geral=avaliacao['nota_geral'],
            competencias=competencias,
            observacoes_gerais=avaliacao.get('observacoes_gerais', 'Nenhuma observação adicional'),
            tempo_processamento=tempo_processamento
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro inesperado: {e}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")

@app.get("/")
async def root():
    """
    Endpoint de teste
    """
    return {
        "message": "API de Correção de Redações ENEM",
        "status": "ativo",
        "versao": "1.0.0",
        "endpoints": {
            "correcao": "/corrigir-redacao",
            "documentacao": "/docs"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
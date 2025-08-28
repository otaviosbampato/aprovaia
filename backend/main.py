from fastapi import FastAPI, HTTPException
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
Você é um avaliador especialista em redações do ENEM com anos de experiência. Sua tarefa é analisar a redação fornecida e dar uma avaliação completa e precisa, seguindo rigorosamente os critérios oficiais do ENEM.

INSTRUÇÕES IMPORTANTES:
- Seja rigoroso e justo na avaliação
- Forneça feedback específico e construtivo
- Identifique exemplos concretos do texto para justificar as notas
- Use linguagem clara e educativa
- Considere o nível esperado para o Ensino Médio

{tema_info}

COMPETÊNCIAS A AVALIAR:

1. DOMÍNIO DA ESCRITA FORMAL DA LÍNGUA PORTUGUESA (0-200 pontos)
Avalie: ortografia, acentuação, pontuação, concordância verbal/nominal, regência verbal/nominal, crase, colocação pronominal, paralelismo sintático, adequação vocabular e registro formal.

2. COMPREENDER O TEMA E NÃO FUGIR DO QUE É PROPOSTO (0-200 pontos)
Avalie: compreensão da proposta, desenvolvimento do tema central, manutenção do foco temático, ausência de tangenciamento ou fuga ao tema.

3. SELECIONAR, RELACIONAR, ORGANIZAR E INTERPRETAR INFORMAÇÕES EM DEFESA DE UM PONTO DE VISTA (0-200 pontos)
Avalie: clareza da tese, qualidade e pertinência dos argumentos, uso de informações/dados/exemplos, defesa consistente do ponto de vista, repertório cultural.

4. CONHECIMENTO DOS MECANISMOS LINGUÍSTICOS PARA CONSTRUÇÃO DA ARGUMENTAÇÃO (0-200 pontos)
Avalie: articulação entre parágrafos, uso de conectivos, coesão referencial, progressão temática, estruturação lógica, fluidez na leitura.

5. ELABORAR PROPOSTA DE INTERVENÇÃO RESPEITANDO DIREITOS HUMANOS (0-200 pontos)
Avalie: presença de proposta de intervenção, detalhamento (agente + ação + meio/modo + finalidade + detalhamento), viabilidade, respeito aos direitos humanos, relação com a argumentação.

FORMATO DE RESPOSTA OBRIGATÓRIO - RESPONDA EXATAMENTE NESTE FORMATO JSON:

{{
    "nota_geral": [número de 0 a 1000],
    "competencia_1": {{
        "nota": [0-200],
        "feedback": "Análise detalhada da competência 1 com exemplos específicos do texto",
        "pontos_fortes": "Aspectos positivos identificados",
        "pontos_fracos": "Aspectos que precisam melhorar",
        "sugestoes": "Sugestões específicas para melhoria"
    }},
    "competencia_2": {{
        "nota": [0-200],
        "feedback": "Análise detalhada da competência 2 com exemplos específicos do texto",
        "pontos_fortes": "Aspectos positivos identificados",
        "pontos_fracos": "Aspectos que precisam melhorar",
        "sugestoes": "Sugestões específicas para melhoria"
    }},
    "competencia_3": {{
        "nota": [0-200],
        "feedback": "Análise detalhada da competência 3 com exemplos específicos do texto",
        "pontos_fortes": "Aspectos positivos identificados",
        "pontos_fracos": "Aspectos que precisam melhorar",
        "sugestoes": "Sugestões específicas para melhoria"
    }},
    "competencia_4": {{
        "nota": [0-200],
        "feedback": "Análise detalhada da competência 4 com exemplos específicos do texto",
        "pontos_fortes": "Aspectos positivos identificados",
        "pontos_fracos": "Aspectos que precisam melhorar",
        "sugestoes": "Sugestões específicas para melhoria"
    }},
    "competencia_5": {{
        "nota": [0-200],
        "feedback": "Análise detalhada da competência 5 com exemplos específicos do texto",
        "pontos_fortes": "Aspectos positivos identificados",
        "pontos_fracos": "Aspectos que precisam melhorar",
        "sugestoes": "Sugestões específicas para melhoria"
    }},
    "observacoes_gerais": "Comentários gerais sobre a redação, principais pontos de destaque e orientações para evolução"
}}

--- REDAÇÃO A SER AVALIADA ---
{texto}

IMPORTANTE: Responda APENAS com o JSON válido, sem texto adicional antes ou depois.
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
import React, { useEffect, useRef, useState } from 'react';

interface Message { id: number; type: 'bot' | 'user'; content: string; time: string; }

const botResponses: Record<string,string[]> = {
  matematica: [
    'Para matemática no ENEM, foque em: álgebra, geometria, estatística e funções. Pratique exercícios diariamente! 📊',
    'Dica importante: revise fórmulas básicas e pratique interpretação de gráficos. A matemática do ENEM é muito contextualizada! 📈'
  ],
  redacao:[
    'Para uma boa redação: tenha repertório cultural, pratique a estrutura dissertativa e sempre proponha soluções viáveis! ✍️'
  ],
  cronograma:[
    'Um bom cronograma deve incluir: revisão teórica, exercícios práticos, simulados e descanso. Balance é essencial! 📅'
  ],
  default:[
    'Posso te ajudar com dicas de estudo, explicações de matérias ou orientações para o ENEM. O que você gostaria de saber? 📚'
  ]
};

function chooseResponse(text:string){
  const lower=text.toLowerCase();
  for(const k of Object.keys(botResponses)){
    if(k!== 'default' && lower.includes(k)) return botResponses[k][Math.floor(Math.random()*botResponses[k].length)];
  }
  if(/olá|oi/.test(lower)) return 'Olá! Como posso te ajudar nos seus estudos hoje? 😊';
  if(/obrigad/.test(lower)) return 'De nada! Estou sempre aqui para te ajudar. Boa sorte nos estudos! 🌟';
  return botResponses.default[0];
}

const Chatbot: React.FC = () => {
  const [messages,setMessages]=useState<Message[]>([{
    id:1,type:'bot',content:'Olá! Sou seu assistente de estudos. Como posso te ajudar hoje? 🎓',time:new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})
  }]);
  const [input,setInput]=useState('');
  const [sending,setSending]=useState(false);
  const idRef=useRef(1);
  const listRef=useRef<HTMLDivElement>(null);

  useEffect(()=>{ listRef.current?.scrollTo({top:listRef.current.scrollHeight, behavior:'smooth'}); },[messages]);

  const send = (text:string)=>{
    if(!text.trim()) return;
    setSending(true);
    const time= new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
    idRef.current+=1; const userId=idRef.current;
    setMessages(m=>[...m,{id:userId,type:'user',content:text,time}]);
    setTimeout(()=>{
      const reply=chooseResponse(text);
      idRef.current+=1; const botId=idRef.current;
      const botTime=new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
      setMessages(m=>[...m,{id:botId,type:'bot',content:reply,time:botTime}]);
      setSending(false);
    }, 1000 + Math.random()*1000);
  };

  return (
    <section className="chatbot-section">
      <div className="section-container">
        <h3 className="section-title"><i className="fas fa-robot"/> Assistente IA para Estudos</h3>
        <p className="section-subtitle">Tire suas dúvidas, peça explicações e receba orientações personalizadas de estudo</p>
        <div className="chatbot-container">
          <div className="chat-messages" id="chatMessages" ref={listRef}>
            {messages.map(msg=> (
              <div key={msg.id} className={`message ${msg.type}-message`}>
                <div className="message-avatar">
                  <i className={`fas ${msg.type==='bot'?'fa-robot':'fa-user'}`}/>
                </div>
                <div className="message-content">
                  <p>{msg.content}</p>
                  <span className="message-time">{msg.time}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="chat-input-container">
            <div className="chat-suggestions">
              <button className="suggestion-btn" onClick={()=>send('Como resolver questões de matemática do ENEM?')}><i className="fas fa-calculator"/> Matemática ENEM</button>
              <button className="suggestion-btn" onClick={()=>send('Dicas para melhorar minha redação')}><i className="fas fa-pen"/> Dicas de Redação</button>
              <button className="suggestion-btn" onClick={()=>send('Como criar um cronograma de estudos?')}><i className="fas fa-calendar"/> Cronograma</button>
            </div>
            <form className="chat-form" onSubmit={e=>{e.preventDefault(); send(input); setInput('');}}>
              <div className="input-group">
                <input type="text" value={input} onChange={e=>setInput(e.target.value)} placeholder="Digite sua pergunta ou dúvida..." autoComplete="off" />
                <button type="submit" className="send-btn" disabled={sending}><i className="fas fa-paper-plane"/></button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Chatbot;

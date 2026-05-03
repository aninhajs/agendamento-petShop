import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const chatWithBot = async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({ msg: "Mensagem é obrigatória" });
    }

    // Contexto sobre o pet shop
    const systemMessage = {
      role: "system",
      content: `Você é um assistente virtual amigável de um Pet Shop. Seu papel é ajudar clientes com informações sobre:

- Serviços disponíveis: Banho completo, Tosa higiênica e estética, Cuidados especiais (hidratação, escovação de dentes, corte de unhas)
- Agendamentos: Sistema online disponível 24/7
- Horários: Segunda a sábado
- Profissionais qualificados e ambiente acolhedor
- Responda sempre em português do Brasil de forma educada e prestativa
- Se não souber algo específico sobre preços ou disponibilidade, sugira que o cliente entre em contato ou faça o agendamento online
- Seja breve e objetivo nas respostas
- Mostre carinho e cuidado com os animais de estimação`,
    };

    // Monta o histórico da conversa
    const messages = [
      systemMessage,
      ...conversationHistory,
      { role: "user", content: message },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 0.7,
      max_tokens: 300,
    });

    const botResponse = completion.choices[0].message.content;

    res.json({
      response: botResponse,
      conversationHistory: [
        ...conversationHistory,
        { role: "user", content: message },
        { role: "assistant", content: botResponse },
      ],
    });
  } catch (error) {
    console.error("Erro no chatbot:", error);
    res.status(500).json({
      msg: "Erro ao processar mensagem",
      error: error.message,
    });
  }
};

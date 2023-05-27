import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Input, Button, ListItem } from 'react-native-elements';
import { Text } from 'react-native';
import openai from 'openai';

// Defina sua chave de API do OpenAI
//openai.apiKey = 'YOUR_OPENAI_API_KEY';

const App = () => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSendMessage = async () => {
    if (inputValue.trim() !== '') {
      const newMessage = {
        text: inputValue,
        sentiment: await analyzeSentiment(inputValue),
      };
      setMessages([...messages, newMessage]);
      setInputValue('');
    }
  };

  const handleLongPress = (index) => {
    const updatedMessages = [...messages];
    updatedMessages.splice(index, 1);
    setMessages(updatedMessages);
  };

  const analyzeSentiment = async (text) => {
    // Use a API do OpenAI para enviar a frase e obter a resposta do modelo
    const response = await openai.complete({
      engine: 'text-davinci-003',
      prompt: `Analyze the sentiment of the following text: "${text}"\nSentiment:`,
      maxTokens: 1,
    });

    // Verifique a resposta do modelo e retorne o sentimento
    const sentiment = response.data.choices[0].text.trim().toLowerCase();
    if (sentiment === 'positive') {
      return 'Positivo';
    } else if (sentiment === 'negative') {
      return 'Negativo';
    } else {
      return 'Neutro';
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        {messages.map((message, index) => (
          <ListItem
            key={index}
            title={message.text}
            subtitle={`Sentimento: ${message.sentiment}`}
            onLongPress={() => handleLongPress(index)}
            bottomDivider
            chevron
          />
        ))}
      </ScrollView>
      <View style={{ padding: 10 }}>
        <Input
          placeholder="Digite uma frase"
          value={inputValue}
          onChangeText={(text) => setInputValue(text)}
        />
        <Button title="Enviar" onPress={handleSendMessage} />
      </View>
    </View>
  );
};

export default App;
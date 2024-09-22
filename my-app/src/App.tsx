import React, { useEffect, useState } from 'react';
import './App.css';
import AudienceSelect from './functions/AudienceSelect';
import LLMInput from './functions/LLMInput';
import { ollamaService } from './ollama_service/ollama_service';

function App() {

    const [audience, setAudience] = useState('');
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [inputValue, setInputValue] = useState<string>('');

    const handleAudienceChange = (newAudience: string) => {
        setAudience(newAudience);
        if (newAudience) {
            setIsTransitioning(true);
            setTimeout(() => setIsTransitioning(false), 500);
        }
    };

    useEffect(() => {
      if (audience) {
        const primePrompt = `You are about to present a topic to ${audience}. 
        After presenting you will ask 7 questions about the presentation topic.
        These questions must come from a typical ${audience}.`
        ollamaService.primeOllama(primePrompt)
          .then(() => console.log(`Ollama primed with audience ${audience}`))
          .catch((error) => console.error(`Error priming Ollama:`, error))
      }
    }, [audience])

    // TEMPORARY
    // const handleLLMSubmit = async (message: string) => {
    //   try {
    //     console.log('Submitted message', message)
    //     setInputValue(message)
    //     const response = ollamaService.sendMessage(message)
    //     console.log('LLM Response', response)
    //   } catch (error) {
    //     console.error('Error from LLM', error)
    //   }


        // console.log('Submitted message:', message);
        // setInputValue(message);
        // // Here you would typically send the message to your LLM
    };

    // const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    //     event.preventDefault();
    //     console.log(inputValue);
    // };

    return (
        <div className="app-container">
            <div style={{
                transition: 'all 0.5s ease-in-out',
                opacity: isTransitioning || audience ? 0 : 1,
                transform: `translateY(${isTransitioning || audience ? '-100%' : '0'})`
            }}>
                <AudienceSelect audience={audience} onAudienceChange={handleAudienceChange} disabled={!!audience}/>
            </div>
            <div style={{
                transition: 'all 0.5s ease-in-out',
                opacity: isTransitioning || !audience ? 0 : 1,
                transform: `translateY(${isTransitioning || !audience ? '100%' : '0'})`
            }}>
                <LLMInput onSubmit={handleLLMSubmit} />
            </div>
        </div>
    );
}

export default App;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { generateImage, GenerationConfig } from '../../services/geminiService';
import { useGlobalState } from '../../context/GlobalStateContext';

type AspectRatio = "1:1" | "3:4" | "4:3" | "9:16" | "16:9";
interface GeneratedImage {
    id: string;
    src: string;
    prompt: string;
}

const aspectRatios: AspectRatio[] = ["1:1", "16:9", "9:16", "4:3", "3:4"];
const stylePresets = ['Photorealistic', 'Anime', 'Fantasy', 'Cyberpunk', 'Minimalist', '3D Render'];

const SkeletonLoader: React.FC = () => (
    <div className="aspect-square bg-gray-700 rounded-lg animate-pulse"></div>
);

const ImageGeneratorPage: React.FC = () => {
    const { currentUser, dispatch } = useGlobalState();
    const navigate = useNavigate();

    const [prompt, setPrompt] = useState('');
    const [negativePrompt, setNegativePrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            toast.error("Please enter a prompt.");
            return;
        }

        if (currentUser?.status === 'blocked') {
            toast.error("Your account is blocked. You cannot generate images.");
            return;
        }

        if (!currentUser || currentUser.credits < 1) {
            toast.error("You don't have enough credits to generate an image.");
            navigate('/buy-credits');
            return;
        }
        
        setIsGenerating(true);
        const toastId = toast.loading('Generating your masterpiece...');

        // Deduct credit first
        dispatch({ type: 'UPDATE_USER_CREDITS', payload: { userId: currentUser.id, credits: -1 }});
        
        try {
            const config: GenerationConfig = {
                prompt,
                aspectRatio,
                negativePrompt,
            };
            const imageSrc = await generateImage(config);
            
            const newImage: GeneratedImage = {
                id: `${Date.now()}`,
                src: imageSrc,
                prompt: prompt,
            };

            setGeneratedImages(prev => [newImage, ...prev]);
            toast.success('Image generated successfully!', { id: toastId });
        } catch (error) {
            console.error(error);
            toast.error(error instanceof Error ? error.message : "An unknown error occurred.", { id: toastId });
            // Refund credit on failure
            dispatch({ type: 'UPDATE_USER_CREDITS', payload: { userId: currentUser.id, credits: 1 }});
        } finally {
            setIsGenerating(false);
        }
    };

    const deleteImage = (id: string) => {
        setGeneratedImages(prev => prev.filter(img => img.id !== id));
    };
    
    const downloadImage = (src: string, prompt: string) => {
        const link = document.createElement('a');
        link.href = src;
        link.download = `${prompt.slice(0, 30).replace(/\s+/g, '_')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Controls */}
            <div className="lg:col-span-1 space-y-6">
                <h1 className="text-3xl font-bold text-white">Image Generator</h1>
                <div>
                    <label htmlFor="prompt" className="block text-sm font-medium text-gray-300">Prompt</label>
                    <textarea
                        id="prompt"
                        rows={4}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm text-white focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        placeholder="e.g., A cinematic shot of a raccoon in a space suit, high detail"
                    />
                </div>
                 <div>
                    <label htmlFor="negative-prompt" className="block text-sm font-medium text-gray-300">Negative Prompt (UI Only)</label>
                    <textarea
                        id="negative-prompt"
                        rows={2}
                        value={negativePrompt}
                        onChange={(e) => setNegativePrompt(e.target.value)}
                        className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm text-white focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        placeholder="e.g., ugly, blurry, watermark"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300">Style Presets</label>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {stylePresets.map(style => (
                            <button key={style} onClick={() => setPrompt(p => `${style}, ${p}`)} className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded-full transition-colors">
                                {style}
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300">Aspect Ratio</label>
                    <div className="mt-2 grid grid-cols-5 gap-2">
                        {aspectRatios.map(ratio => (
                            <button key={ratio} onClick={() => setAspectRatio(ratio)} className={`p-2 rounded-md transition-colors ${aspectRatio === ratio ? 'bg-primary-600 ring-2 ring-primary-400' : 'bg-gray-700 hover:bg-gray-600'}`}>
                                {ratio}
                            </button>
                        ))}
                    </div>
                </div>
                <button
                    onClick={handleGenerate}
                    disabled={isGenerating || currentUser?.status === 'blocked'}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-4 rounded-md transition duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {isGenerating && <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                    Generate (1 Credit)
                </button>
            </div>

            {/* Gallery */}
            <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold text-white mb-4">Session Gallery</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {isGenerating && <SkeletonLoader />}
                    {generatedImages.length > 0 ? (
                        generatedImages.map(image => (
                            <div key={image.id} className="group relative rounded-lg overflow-hidden">
                                <img src={image.src} alt={image.prompt} className="aspect-square w-full object-cover" />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                    <p className="text-xs text-gray-300 mb-2 truncate">{image.prompt}</p>
                                    <div className="flex justify-end space-x-2">
                                        <button onClick={() => downloadImage(image.src, image.prompt)} className="p-2 bg-gray-700/80 rounded-full hover:bg-primary-600"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg></button>
                                        <button onClick={() => deleteImage(image.id)} className="p-2 bg-gray-700/80 rounded-full hover:bg-red-600"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        !isGenerating && <p className="col-span-full text-center text-gray-400 py-10">Your generated images will appear here.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImageGeneratorPage;

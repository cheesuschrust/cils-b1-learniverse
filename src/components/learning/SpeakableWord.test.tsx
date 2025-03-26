
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@/tests/test-utils';
import userEvent from '@testing-library/user-event';
import SpeakableWord from './SpeakableWord';
import * as textToSpeechUtils from '@/utils/textToSpeech';
import { useAIUtils } from '@/contexts/AIUtilsContext';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

// Mock dependencies
jest.mock('@/utils/textToSpeech', () => ({
  speak: jest.fn().mockResolvedValue(undefined),
  isSpeechSupported: jest.fn().mockReturnValue(true),
  stopSpeaking: jest.fn(),
}));

jest.mock('@/contexts/AIUtilsContext', () => ({
  useAIUtils: jest.fn(),
}));

jest.mock('@/contexts/UserPreferencesContext', () => ({
  useUserPreferences: jest.fn(),
}));

jest.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

describe('SpeakableWord Component', () => {
  beforeEach(() => {
    // Set up default mocks
    (useAIUtils as jest.Mock).mockReturnValue({
      isAIEnabled: true,
    });
    
    (useUserPreferences as jest.Mock).mockReturnValue({
      voicePreference: {
        voiceRate: 1,
        voicePitch: 1,
        italianVoiceURI: 'italian-voice',
        englishVoiceURI: 'english-voice',
      },
      autoPlayAudio: false,
    });
    
    jest.clearAllMocks();
  });

  test('renders correctly with a word', () => {
    render(<SpeakableWord word="Ciao" />);
    
    expect(screen.getByText('Ciao')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  test('plays audio when button is clicked', async () => {
    const speakMock = textToSpeechUtils.speak as jest.Mock;
    
    render(<SpeakableWord word="Ciao" language="it" />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(speakMock).toHaveBeenCalledWith('Ciao', 'it', expect.any(Object));
  });

  test('displays error when speech synthesis is not supported', async () => {
    (textToSpeechUtils.isSpeechSupported as jest.Mock).mockReturnValueOnce(false);
    
    render(<SpeakableWord word="Ciao" />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    // Speech shouldn't be attempted
    expect(textToSpeechUtils.speak).not.toHaveBeenCalled();
  });

  test('displays error when AI is disabled', async () => {
    (useAIUtils as jest.Mock).mockReturnValueOnce({
      isAIEnabled: false,
    });
    
    render(<SpeakableWord word="Ciao" />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    // Speech shouldn't be attempted
    expect(textToSpeechUtils.speak).not.toHaveBeenCalled();
  });

  test('auto-plays audio when autoPlay and autoPlayAudio are true', async () => {
    (useUserPreferences as jest.Mock).mockReturnValueOnce({
      voicePreference: {
        voiceRate: 1,
        voicePitch: 1,
        italianVoiceURI: 'italian-voice',
        englishVoiceURI: 'english-voice',
      },
      autoPlayAudio: true,
    });
    
    render(<SpeakableWord word="Ciao" language="it" autoPlay={true} />);
    
    // Auto-play should trigger speech without clicking
    await waitFor(() => {
      expect(textToSpeechUtils.speak).toHaveBeenCalledWith('Ciao', 'it', expect.any(Object));
    });
  });

  test('does not auto-play when autoPlay is true but autoPlayAudio is false', () => {
    (useUserPreferences as jest.Mock).mockReturnValueOnce({
      voicePreference: {
        voiceRate: 1,
        voicePitch: 1,
        italianVoiceURI: 'italian-voice',
        englishVoiceURI: 'english-voice',
      },
      autoPlayAudio: false,
    });
    
    render(<SpeakableWord word="Ciao" language="it" autoPlay={true} />);
    
    // Speech should not be triggered
    expect(textToSpeechUtils.speak).not.toHaveBeenCalled();
  });

  test('calls onPlayComplete callback after speaking', async () => {
    const onPlayCompleteMock = jest.fn();
    (textToSpeechUtils.speak as jest.Mock).mockResolvedValueOnce(undefined);
    
    render(
      <SpeakableWord 
        word="Ciao" 
        language="it" 
        onPlayComplete={onPlayCompleteMock} 
      />
    );
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(onPlayCompleteMock).toHaveBeenCalledTimes(1);
    });
  });

  test('applies different size classes', () => {
    const { rerender } = render(<SpeakableWord word="Ciao" size="default" />);
    
    // Default size
    let button = screen.getByRole('button');
    expect(button).toHaveClass('h-6');
    
    // Small size
    rerender(<SpeakableWord word="Ciao" size="sm" />);
    button = screen.getByRole('button');
    expect(button).toHaveClass('h-5');
    
    // Large size
    rerender(<SpeakableWord word="Ciao" size="lg" />);
    button = screen.getByRole('button');
    expect(button).toHaveClass('h-8');
  });

  test('handles onClick prop', () => {
    const handleClick = jest.fn();
    
    render(<SpeakableWord word="Ciao" onClick={handleClick} />);
    
    // Click on the text (not the button)
    fireEvent.click(screen.getByText('Ciao'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('does not show tooltip when showTooltip is false', () => {
    render(<SpeakableWord word="Ciao" showTooltip={false} />);
    
    const button = screen.getByRole('button');
    
    // Tooltips in this implementation use aria-describedby to connect them
    expect(button).not.toHaveAttribute('aria-describedby');
  });

  test('shows custom tooltip content when provided', async () => {
    render(
      <SpeakableWord 
        word="Ciao" 
        tooltipContent="Custom tooltip" 
      />
    );
    
    const button = screen.getByRole('button');
    
    // Hover over button to show tooltip
    userEvent.hover(button);
    
    await waitFor(() => {
      expect(screen.getByText('Custom tooltip')).toBeInTheDocument();
    });
  });

  test('stops speaking when component unmounts', () => {
    const { unmount } = render(<SpeakableWord word="Ciao" />);
    
    // Click to start speaking
    fireEvent.click(screen.getByRole('button'));
    
    // Unmount component
    unmount();
    
    // Should call stopSpeaking on unmount
    expect(textToSpeechUtils.stopSpeaking).toHaveBeenCalled();
  });
});

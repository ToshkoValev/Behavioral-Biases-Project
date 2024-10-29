let audioStream = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'startRecording') {
    startRecording(message.meetingLink)
      .then(() => sendResponse({ success: true }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Keep message channel open for async response
  }
  
  if (message.action === 'stopRecording') {
    stopRecording()
      .then(() => sendResponse({ success: true }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }
});

async function startRecording(meetingLink) {
  try {
    // Request tab capture
    const stream = await chrome.tabCapture.capture({
      audio: true,
      video: false
    });
    
    audioStream = stream;
    
    // Here we'll later add code to:
    // 1. Process the audio stream
    // 2. Connect to Whisper API
    // 3. Handle transcription
    
  } catch (error) {
    console.error('Failed to start recording:', error);
    throw error;
  }
}

async function stopRecording() {
  if (audioStream) {
    audioStream.getTracks().forEach(track => track.stop());
    audioStream = null;
  }
}
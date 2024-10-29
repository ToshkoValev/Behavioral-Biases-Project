document.addEventListener('DOMContentLoaded', function() {
    const meetingLinkInput = document.getElementById('meetingLink');
    const startBtn = document.getElementById('startBtn');
    const statusDiv = document.getElementById('status');
    let isRecording = false;
  
    // Check if we're already recording
    chrome.storage.local.get(['isRecording'], function(result) {
      isRecording = result.isRecording || false;
      updateUI();
    });
  
    startBtn.addEventListener('click', function() {
      if (!isRecording) {
        startRecording();
      } else {
        stopRecording();
      }
    });
  
    function startRecording() {
      const meetingLink = meetingLinkInput.value.trim();
      if (!meetingLink) {
        alert('Please enter a valid meeting link or ID');
        return;
      }
  
      chrome.runtime.sendMessage({ 
        action: 'startRecording',
        meetingLink: meetingLink 
      }, function(response) {
        if (response && response.success) {
          isRecording = true;
          chrome.storage.local.set({ isRecording: true });
          updateUI();
        } else {
          alert('Failed to start recording: ' + (response?.error || 'Unknown error'));
        }
      });
    }
  
    function stopRecording() {
      chrome.runtime.sendMessage({ action: 'stopRecording' }, function(response) {
        if (response && response.success) {
          isRecording = false;
          chrome.storage.local.set({ isRecording: false });
          updateUI();
        }
      });
    }
  
    function updateUI() {
      startBtn.textContent = isRecording ? 'Stop Recording' : 'Start Recording';
      statusDiv.style.display = isRecording ? 'block' : 'none';
      meetingLinkInput.disabled = isRecording;
    }
  });
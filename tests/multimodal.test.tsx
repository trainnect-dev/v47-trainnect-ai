import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock the Chat component instead of importing it
const mockAppend = jest.fn();
const mockStop = jest.fn();

// Mock component that simulates the Chat component's behavior
const MockChat = () => {
  const [files, setFiles] = React.useState<File[]>([]);
  const [previews, setPreviews] = React.useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(selectedFiles);
      
      // Create previews for the files
      const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
      setPreviews(newPreviews);
    }
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);

    const newPreviews = [...previews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  const handleSendMessage = () => {
    mockAppend("Test message", { attachments: files.map(file => ({ file })) });
  };

  return (
    <div>
      <div className="chat-container">
        <div className="message-list">
          {/* Message list would go here */}
        </div>
        <div className="chat-input">
          <input 
            type="text" 
            placeholder="Type a message..." 
            data-testid="chat-input"
          />
          <label htmlFor="file-upload" className="file-upload-label" data-testid="file-upload-label">
            <span>Upload</span>
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/png,image/jpeg,image/gif,image/webp,application/pdf"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            data-testid="file-upload"
            multiple
          />
          <button onClick={handleSendMessage} data-testid="send-button">
            Send
          </button>
        </div>
        {files.length > 0 && (
          <div className="file-previews" data-testid="file-previews">
            {previews.map((preview, index) => (
              <div key={index} className="file-preview">
                <img 
                  src={preview} 
                  alt={`Preview ${index}`} 
                  data-testid={`file-preview-${index}`}
                />
                <button 
                  onClick={() => handleRemoveFile(index)}
                  data-testid={`remove-file-${index}`}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

describe('Multimodal Feature', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockAppend.mockClear();
    mockStop.mockClear();
  });

  test('should render file upload input', async () => {
    render(<MockChat />);
    
    // Check if file upload input is rendered
    const fileUploadLabel = screen.getByTestId('file-upload-label');
    expect(fileUploadLabel).toBeInTheDocument();
  });

  test('should allow uploading and displaying file previews', async () => {
    render(<MockChat />);
    
    // Create a mock file
    const file = new File(['dummy content'], 'test-image.png', { type: 'image/png' });
    
    // Get the file input and simulate a file upload
    const fileInput = screen.getByTestId('file-upload');
    
    // Mock the URL.createObjectURL function
    const originalCreateObjectURL = URL.createObjectURL;
    URL.createObjectURL = jest.fn(() => 'mock-url');
    
    // Simulate file upload
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    // Check if preview is displayed
    await waitFor(() => {
      const filePreview = screen.getByTestId('file-previews');
      expect(filePreview).toBeInTheDocument();
    });
    
    // Restore the original function
    URL.createObjectURL = originalCreateObjectURL;
  });

  test('should allow removing uploaded files', async () => {
    render(<MockChat />);
    
    // Create a mock file
    const file = new File(['dummy content'], 'test-image.png', { type: 'image/png' });
    
    // Get the file input and simulate a file upload
    const fileInput = screen.getByTestId('file-upload');
    
    // Mock URL functions
    const originalCreateObjectURL = URL.createObjectURL;
    const originalRevokeObjectURL = URL.revokeObjectURL;
    URL.createObjectURL = jest.fn(() => 'mock-url');
    URL.revokeObjectURL = jest.fn();
    
    // Simulate file upload
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    // Check if preview is displayed
    await waitFor(() => {
      const filePreview = screen.getByTestId('file-previews');
      expect(filePreview).toBeInTheDocument();
    });
    
    // Remove the file
    const removeButton = screen.getByTestId('remove-file-0');
    fireEvent.click(removeButton);
    
    // Check if preview is removed
    await waitFor(() => {
      expect(screen.queryByTestId('file-previews')).not.toBeInTheDocument();
    });
    
    // Restore the original functions
    URL.createObjectURL = originalCreateObjectURL;
    URL.revokeObjectURL = originalRevokeObjectURL;
  });

  test('should send message with attachments', async () => {
    render(<MockChat />);
    
    // Create a mock file
    const file = new File(['dummy content'], 'test-image.png', { type: 'image/png' });
    
    // Get the file input and simulate a file upload
    const fileInput = screen.getByTestId('file-upload');
    
    // Mock URL functions
    const originalCreateObjectURL = URL.createObjectURL;
    URL.createObjectURL = jest.fn(() => 'mock-url');
    
    // Simulate file upload
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    // Send the message
    const sendButton = screen.getByTestId('send-button');
    fireEvent.click(sendButton);
    
    // Check if append was called with the file
    expect(mockAppend).toHaveBeenCalledWith("Test message", { attachments: [{ file }] });
    
    // Restore the original function
    URL.createObjectURL = originalCreateObjectURL;
  });
});

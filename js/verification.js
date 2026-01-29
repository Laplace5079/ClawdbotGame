// Email verification system

// Simulate sending a verification email with code
function sendVerificationEmail(email, verificationCode) {
    console.log(`Sending verification email to ${email} with code: ${verificationCode}`);
    
    // In a real app, this would use an email service (e.g., SendGrid, SMTP)
    // For now, we'll just log the action
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true, message: 'Verification email sent successfully' });
        }, 1000);
    });
}

// Verify the code entered by user
function verifyCode(enteredCode, expectedCode) {
    return enteredCode === expectedCode;
}

// Function to handle verification process
async function handleVerification(email, enteredCode) {
    const verificationCode = generateVerificationCode(); // Generate a random code
    
    try {
        // Send the verification email
        const result = await sendVerificationEmail(email, verificationCode);
        
        if (result.success) {
            console.log('Verification process initiated');
            return { success: true, message: 'Verification email sent. Please check your inbox.' };
        }
    } catch (error) {
        console.error('Error sending verification email:', error);
        return { success: false, message: 'Failed to send verification email. Please try again later.' };
    }
}

// Generate a random 6-character alphanumeric code
function generateVerificationCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// Example usage:
// handleVerification('user@example.com', 'ABC123');
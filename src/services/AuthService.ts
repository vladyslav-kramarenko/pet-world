import {
    signIn as amplifySignIn,
    signUp as amplifySignUp,
    confirmSignUp as amplifyConfirmSignUp,
    resendSignUpCode as amplifyResendSignUpCode,
    SignUpInput,
    ResendSignUpCodeInput
} from '@aws-amplify/auth';


const AuthService = {
    // Register a new user
    async signUp(email: string, password: string) {
        const signUpData: SignUpInput = {
            username: email,
            password,
        };

        try {
            const result = await amplifySignUp(signUpData);
            return result;
        } catch (error) {
            console.error('Error during sign up:', error);
            throw error;
        }
    },

    // Confirm user sign-up with confirmation code
    async confirmSignUp(email: string, confirmationCode: string) {
        try {
            const result = await amplifyConfirmSignUp({
                username: email,
                confirmationCode,
            });
            return result;
        } catch (error) {
            console.error('Error during confirmation:', error);
            throw error;
        }
    },

    // Resend sign-up confirmation code
    async resendSignUp(email: string) {
        const resendInput: ResendSignUpCodeInput = {
            username: email,
        };

        try {
            const result = await amplifyResendSignUpCode(resendInput);
            return result;
        } catch (error) {
            console.error('Error resending confirmation code:', error);
            throw error;
        }
    },

    // Sign-in the user
    async signIn(email: string, password: string) {
        try {
            const result = await amplifySignIn({
                username: email,
                password,
            });
            return result;
        } catch (error) {
            console.error('Error signing in:', error);
            throw error;
        }
    },

};

export default AuthService;

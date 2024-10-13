import {
    signIn as amplifySignIn,
    signUp as amplifySignUp,
    signOut as amplifySignOut,
    confirmSignUp as amplifyConfirmSignUp,
    resendSignUpCode as amplifyResendSignUpCode,
    getCurrentUser as amplifyGetCurrentUser,
    fetchUserAttributes as amplifyFetchUserAttributes,
    updateUserAttributes as amplifyUpdateUserAttributes,
    SignUpInput,
    ResendSignUpCodeInput,
    UpdateUserAttributesInput
} from '@aws-amplify/auth';

/**
 * AuthService - A service to handle all authentication-related operations
 * using AWS Amplify Auth.
 */
const AuthService = {

    /**
     * Registers a new user with the given email, password, first name, and last name.
     * @param email - The user's email address.
     * @param password - The user's password.
     * @param firstName - The user's first name.
     * @param lastName - The user's last name.
     * @returns A promise that resolves with the result of the sign-up operation.
     * @throws Will throw an error if the sign-up fails.
     */
    async signUp(email: string, password: string, firstName: string, lastName: string) {
        const signUpData: SignUpInput = {
            username: email,
            password,
            options: {
                userAttributes: {
                    email: email,
                    given_name: firstName,
                    family_name: lastName,
                }
            },
        };

        try {
            const result = await amplifySignUp(signUpData);
            return result;
        } catch (error) {
            console.error('Error during sign up:', error);
            throw error;
        }
    },

    /**
     * Confirms the user's sign-up using the confirmation code sent to their email.
     * @param email - The user's email address.
     * @param confirmationCode - The confirmation code sent to the user.
     * @returns A promise that resolves when the confirmation is successful.
     * @throws Will throw an error if the confirmation fails.
     */
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

    /**
     * Resends the sign-up confirmation code to the user's email.
     * @param email - The user's email address.
     * @returns A promise that resolves when the code is successfully sent.
     * @throws Will throw an error if resending the confirmation code fails.
     */
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

    /**
     * Signs in the user with their email and password.
     * @param email - The user's email address.
     * @param password - The user's password.
     * @returns A promise that resolves when the sign-in is successful.
     * @throws Will throw an error if the sign-in fails.
     */
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

    /**
     * Fetches the currently authenticated user's information.
     * @returns A promise that resolves with the current user's details.
     * @throws Will throw an error if fetching the current user fails.
     */
    async getCurrentUser() {
        try {
            const user = await amplifyGetCurrentUser();
            return user;
        } catch (err: any) {
            if (err.name === 'UserUnAuthenticatedException') {
                console.warn('User is not authenticated');
                return null; // Return null if the user is not authenticated
            }
            console.error('Error fetching current user:', err);
            throw err;
        }
    },

    /**
     * Fetches the current user's attributes such as email, given name, and family name.
     * @returns A promise that resolves with the user's attributes.
     * @throws Will throw an error if fetching the attributes fails.
     */
    async getCurrentUserAttributes() {
        try {
            const userAttributes = await amplifyFetchUserAttributes();
            return userAttributes;
        } catch (err) {
            console.error('Error fetching current user attributes:', err);
            throw err;
        }
    },

    /**
     * Updates the user's attributes such as first name and last name.
     * @param firstName - The new first name for the user.
     * @param lastName - The new last name for the user.
     * @returns A promise that resolves when the update is successful.
     * @throws Will throw an error if the update fails.
     */
    async updateUserAttributes(firstName: string, lastName: string) {
        try {
            const updateInput: UpdateUserAttributesInput = {
                userAttributes: {
                    'given_name': firstName,
                    'family_name': lastName,
                },
                options: {
                    clientMetadata: {}, // Add metadata if needed
                },
            };
            const result = await amplifyUpdateUserAttributes(updateInput);
            return result;
        } catch (err) {
            console.error('Error updating user attributes:', err);
            throw err;
        }
    },

    /**
     * Signs out the currently authenticated user.
     * @returns A promise that resolves when the sign-out is successful.
     * @throws Will throw an error if the sign-out fails.
     */
    async signOut() {
        try {
            await amplifySignOut();
        } catch (err) {
            console.error('Error signing out:', err);
            throw err;
        }
    }
};

export default AuthService;
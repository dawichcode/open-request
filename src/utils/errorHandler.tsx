/* eslint-disable @typescript-eslint/no-explicit-any */
export const handleError = (error: any): string => {
    if(error) {
        if (error.response && error.response.data && error.response.data.message) {
            return error.response.data.message;
        } else if (error.message) {
            return error.message;
        }
    }
    return 'An unknown error occurred';
};

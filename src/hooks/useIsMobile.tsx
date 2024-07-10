export const useIsMobile = (userAgent: string): boolean => {
    return /Android|android.+mobile|ip(hone|[oa]d)/i.test(userAgent);
};

const internalErrorResponse = (msg: string) => {
    console.error(msg);
    return {
        statusCode: 500,
        headers: { "Content-Type": "text/plain" },
        body: "internal error",
    };
};

export default internalErrorResponse
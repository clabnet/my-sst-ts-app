const badRequestResponse = (msg: string) => {
    return {
        statusCode: 400,
        headers: { "Content-Type": "text/plain" },
        body: msg,
    };
}


export default badRequestResponse
const successResponse = <T>(item: T) => {
    return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
    };
};

export default successResponse;
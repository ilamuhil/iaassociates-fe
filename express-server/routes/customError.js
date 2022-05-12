class IAError extends Error {
    constructor(message,code) {
        super(message);
        this.status = "error"
        this.code = code;
    }
}
try {
    throw new IAError("this is another error",403);
} catch (e) {
    console.log(e);
}
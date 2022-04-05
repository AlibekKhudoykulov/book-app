class Validator {
    isValid(data) {
        return !(
            data.title.trim() === "" ||
            data.body.trim() === "" ||
            data.author.trim() === ""
        );
    }
}

module.exports = Validator;

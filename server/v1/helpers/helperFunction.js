import jwt from 'jsonwebtoken'


class helperFunction {

    handleValidation(err) {
        const messages = []
        for (let field in err.errors) { return err.errors[field].message; }
        return messages;
    }

    authTokenGenerate(name, userId) {
        return jwt.sign({ username: name, userId: userId },
            'secretChatModule'
        );
    }

}

export default helperFunction
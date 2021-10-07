import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

const options = {
    swaggerDefinition:{
        openapi: "3.0.0",
        info: {
            title: "SNSLogin_Typescript API",
            version: "1.0.0",
            description: "SNSLogin_Typescript API 문서"
        },
        host: 'localhost',
        basePath: '/'
    },
    apis: ['./routes/*.ts', './swagger/*']
};

const specs = swaggerJSDoc(options);

export {swaggerUi, specs};
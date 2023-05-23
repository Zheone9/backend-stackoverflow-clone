const chai = require('chai');
const chaiHttp = require('chai-http');
const supertest = require('supertest');
const { expect } = chai;
//
chai.use(chaiHttp);
const expressApp=require('../index')

//
async function loginAndGetToken() {
    const loginResponse = await supertest(expressApp)
        .post('/api/auth')
        .send({
            username: 'vergaas',
            password: '123456',
        });

    const jwtToken = loginResponse.headers['set-cookie'][0]
        .split(';')[0]
        .split('=')[1];

    return jwtToken;
}




//
//
//
describe('Rate Limiter Test', () => {
    // let jwtToken;
    //
    // before(async () => {
    //     // Realiza el inicio de sesión y obtén el JWT token antes de ejecutar las pruebas
    //     jwtToken = await loginAndGetToken();
    //     console.log(jwtToken)
    // });

    const request = supertest.agent(expressApp);

    it.skip('should block 101 requests within 15 minutes', async () => {
        for (let i = 0; i < 101; i++) {
            const loginResponse = await supertest(expressApp)
                .post('/api/auth')
                .send({
                    username: 'vergaas',
                    password: '123456',
                });

            // console.log(response)

            if (i === 101) {
                expect(loginResponse.status).to.equal(429);
                expect(loginResponse.text).to.equal(
                    'Has excedido el límite de intentos de inicio de sesión. Inténtalo de nuevo más tarde.'
                );
            }

        }
    });

    it('should block requests after 30 within an hour', async () => {
        for (let i = 0; i < 31; i++) {
            const response = await request
                .post('/api/questions/create') // Reemplaza '/forum' con la ruta a la que aplicaste el rate limiter
                .set('Cookie', `jwtToken=${token}`).send({
                    title:'ajssajsaasjasjassaas',
                    body:'asjassajasjsaiiiiiiiiiii',
                    token:'10000000-aaaa-bbbb-cccc-000000000001'
                })
                // console.log(response)
            if (i === 29) {
                expect(response.status).to.equal(429);
                expect(response.text).to.equal(
                    'Has excedido el límite de publicaciones permitidas. Inténtalo de nuevo más tarde.'
                );
            }
        }
    });
});

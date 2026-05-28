npx nest g module auth --no-spec
npx nest g controller auth --no-spec
npx nest g service auth --no-spec
npx nest g module users --no-spec
npx nest g controller users --no-spec
npx nest g service users --no-spec
npx nest g module categories --no-spec
npx nest g controller categories --no-spec
npx nest g service categories --no-spec
npx nest g module products --no-spec
npx nest g controller products --no-spec
npx nest g service products --no-spec
npx nest g module cart --no-spec
npx nest g controller cart --no-spec
npx nest g service cart --no-spec
npx nest g module orders --no-spec
npx nest g controller orders --no-spec
npx nest g service orders --no-spec

npm install @nestjs/passport passport passport-local passport-jwt @nestjs/jwt bcrypt
npm install --save-dev @types/passport-local @types/passport-jwt @types/bcrypt
npm install prisma --save-dev
npm install @prisma/client
npx prisma init

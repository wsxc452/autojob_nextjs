# 新增表后操作
npx prisma migrate dev --name add-search-table
npx prisma generate


Okay so after i run pnpm install 
@prisma/client and then execute it with 
pnpm exec prisma migrate pnpm exec 
prisma migrate dev --name init` its working.


pnpm exec prisma migrate



# 上线操作
# 1.打包除了node_module .history 文件，zip
## .env文件需要上传，git忽略了此文件
# 2. 上传到HK服务器， 解压zip
# 3. linux终端 yarn yarn build，
# 4. node网址 执行 yarn start，运行项目
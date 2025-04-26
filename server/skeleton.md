npm init -y
npm i pg express cors sequelize
npm i -D sequelize-cli nodemon dotenv

npx sequelize-cli init

npx sequelize-cli model:generate --name Employee --attributes name:string,email:string,phone:string,department_id:integer,job_position_id:integer,hire_date:date,status:string

npx sequelize-cli model:generate --name Skill --attributes name:string,description:string

npx sequelize-cli model:generate --name Department --attributes name:string,location:string

npx sequelize-cli model:generate --name JobPosition --attributes title:string,department_id:integer

npx sequelize-cli model:generate --name Performance --attributes employee_id:integer,evaluation_date:date,score:integer,feedback:text

npx sequelize-cli model:generate --name TalentPool --attributes candidate_name:string,email:string,phone:string,status:string

npx sequelize-cli model:generate --name EmployeeSkill --attributes employee_id:integer,skill_id:integer

npx sequelize-cli model:generate --name TalentPoolEmployee --attributes talent_pool_id:integer,employee_id:integer

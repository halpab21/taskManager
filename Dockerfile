### ----- FRONTEND BUILD STAGE ----- ###
FROM node:20 AS frontend-build

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install

COPY frontend/ .
RUN npm run build


### ----- BACKEND BUILD STAGE ----- ###
FROM maven:3.9-eclipse-temurin-21 AS backend-build

WORKDIR /app/backend
COPY backend/pom.xml .
RUN mvn -q dependency:go-offline

COPY backend/ .

# Copy the built frontend into Spring Boot's static resources
COPY --from=frontend-build /app/frontend/dist ./src/main/resources/static

RUN mvn -q -DskipTests package


### ----- RUNTIME STAGE (small + fast) ----- ###
FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=backend-build /app/backend/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]

# Stage 1: Build the application
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
COPY pom.xml .
ARG DB_URL
ARG DB_NAME
ARG DB_USER
ARG DB_PASSWORD
ARG ORIGINS
RUN mvn clean package -DskipTests
COPY src ./src
RUN mvn package -DskipTests -DDB_URL=DB_URL -DDB_NAME=DB_NAME -DDB_USER=DB_USER -DDB_PASSWORD=DB_PASSWORD -DORIGINS=ORIGINS

# Stage 2: Create the final image
FROM openjdk:17-jdk-slim
ARG JAR_FILE=/app/target/*.jar
COPY --from=build ${JAR_FILE} app.jar
# Set the environment variables for database connection
ENV DB_URL=dpg-cjmaol5k5scs73eqq83g-a.frankfurt-postgres.render.com
ENV DB_NAME=unityspacedb
ENV DB_USER=archit
ENV DB_PASSWORD=2j9Tm28Gp8OqGVaPU2urcMK5G7XAD7vm
ENV ORIGINS=http://localhost:3000,https://unityspace-52083.web.app
ENTRYPOINT ["java","-jar","/app.jar"]
FROM openjdk:17-jdk-alpine
RUN apk update && apk add --no-cache maven
#WORKDIR /app
#COPY . .
#RUN mvn package clean -DskipTests
#COPY target/unityspace-0.0.1-SNAPSHOT.jar app.jar
#ENTRYPOINT ["java", "-jar", "app.jar"]

# Set the working directory inside the container
WORKDIR /app

# Copy the Spring Boot application JAR file to the container
#COPY . .
#RUN mvn package clean -DskipTests
COPY target/unityspace-0.0.1-SNAPSHOT.jar app.jar

# Set the environment variables
ENV db_url="jdbc:postgresql://127.0.0.1:5432/unityspacedb1"
ENV db_username="postgres"
ENV db_password="Bluestar@16"


# Run the Spring Boot application
CMD ["java", "-jar", "app.jar"]
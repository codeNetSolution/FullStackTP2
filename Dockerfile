FROM openjdk:17

WORKDIR /app

COPY event-0.0.1-SNAPSHOT.jar /app/event-0.0.1-SNAPSHOT.jar

EXPOSE 9090

CMD ["java", "-jar", "/app/event-0.0.1-SNAPSHOT.jar"]

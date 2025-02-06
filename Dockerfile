# Викор образ Node.js version 20.14(see in terminal: node --version) на базі Alpine Linux
FROM node:20-alpine

# Створюємо директорію для застосунку
RUN mkdir /server

# Створюємо директорію для застосунку (опціонально, бо WORKDIR сам її створює)
WORKDIR /server

# Копіюємо застосунок
COPY ./ ./

# Встановлюємо залежності
RUN npm i

# Відкриваємо порти (хоча в Docker це опціонально)
EXPOSE 3000

# Запускаємо застосунок
CMD ["npm", "run", "start"]

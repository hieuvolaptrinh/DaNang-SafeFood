# mở powershell lên mà chạy nhé ae
docker run -d --name redis -p 6379:6379 redis:7
# chạy lênh này để xem port và host
docker exec -it redis redis-cli

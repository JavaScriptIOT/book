openssl genrsa -out ca-key.pem -des 1024
openssl req -new -key ca-key.pem -out ca-csr.pem
openssl x509 -req -in ca-csr.pem -signkey ca-key.pem -out ca-cert.pem
openssl genrsa -out server-key.pem 1024
openssl req -new -key server-key.pem -config openssl.cnf -out server-csr.pem
openssl x509 -req -CA ca-cert.pem -CAkey ca-key.pem -CAcreateserial -in server-csr.pem -out server-cert.pem -extensions v3_req -extfile openssl.cnf
openssl genrsa -out client-key.pem
openssl req -new -key client-key.pem -out client-csr.pem
openssl x509 -req -CA ca-cert.pem -CAkey ca-key.pem -CAcreateserial -in client-csr.pem -out client-cert.pem


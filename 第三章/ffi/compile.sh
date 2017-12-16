gcc -shared -fpic adc.c -o libadc.so
sudo cp libadc.so /lib

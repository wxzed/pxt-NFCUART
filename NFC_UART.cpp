#include "pxt.h"
using namespace pxt;
namespace NFC_UART {

    //%
    void nfcSetTxBufferSize(int size){
        if(size > 100) {
            size = 100;
        }
        uBit.serial.setTxBufferSize(size);
    }

    //%
    void nfcSetRxBufferSize(int size){
        if(size > 100) {
            size = 100;
        }
        uBit.serial.setRxBufferSize(size);
    }

    //%
    int nfcRxBufferedSize(){
        return uBit.serial.rxBufferedSize();
    }

    //%
    void nfcClearRxBuffer(){
        uBit.serial.clearRxBuffer();
    }

    //%
    void nfcClearTxBuffer(){
        uBit.serial.clearTxBuffer();
    }
}

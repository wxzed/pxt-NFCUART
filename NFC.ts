
enum DataBlockList {
    //% block="1"
    block_1 = 1,
    //% block="2"
    block_2 = 2,
    //% block="4"
    block_4 = 4,
    //% block="5"
    block_5 = 5,
    //% block="6"
    block_6 = 6,
    //% block="8"
    block_8 = 8,
    //% block="9"
    block_9 = 9,
    //% block="10"
    block_10 = 10,
    //% block="12"
    block_12 = 12,
    //% block="13"
    block_13 = 13,
    //% block="14"
    block_14 = 14,
    //% block="16"
    block_16 = 16,
    //% block="17"
    block_17 = 17,
    //% block="18"
    block_18 = 18,
    //% block="20"
    block_20 = 20,
    //% block="21"
    block_21 = 21,
    //% block="22"
    block_22 = 22,
    //% block="24"
    block_24 = 24,
    //% block="25"
    block_25 = 25,
    //% block="26"
    block_26 = 26,
    //% block="28"
    block_28 = 28,
    //% block="29"
    block_29 = 29,
    //% block="30"
    block_30 = 30,
    //% block="32"
    block_32 = 32,
    //% block="33"
    block_33 = 33,
    //% block="34"
    block_34 = 34,
    //% block="36"
    block_36 = 36,
    //% block="37"
    block_37 = 37,
    //% block="38"
    block_38 = 38,
    //% block="40"
    block_40 = 40,
    //% block="41"
    block_41 = 41,
    //% block="42"
    block_42 = 42,
    //% block="44"
    block_44 = 44,
    //% block="45"
    block_45 = 45,
    //% block="46"
    block_46 = 46,
    //% block="48"
    block_48 = 48,
    //% block="49"
    block_49 = 49,
    //% block="50"
    block_50 = 50,
    //% block="52"
    block_52 = 52,
    //% block="53"
    block_53 = 53,
    //% block="54"
    block_54 = 54,
    //% block="56"
    block_56 = 56,
    //% block="57"
    block_57 = 57,
    //% block="58"
    block_58 = 58,
    //% block="60"
    block_60 = 60,
    //% block="61"
    block_61 = 61,
    //% block="62"
    block_62 = 62
}


enum byteNumList {
    //% block="1"
    data_1 = 1,
    //% block="2"
    data_2 = 2,
    //% block="3"
    data_3 = 3,
    //% block="4"
    data_4 = 4,
    //% block="5"
    data_5 = 5,
    //% block="6"
    data_6 = 6,
    //% block="7"
    data_7 = 7,
    //% block="8"
    data_8 = 8,
    //% block="9"
    data_9 = 9,
    //% block="10"
    data_10 = 10,
    //% block="11"
    data_11 = 11,
    //% block="12"
    data_12 = 12,
    //% block="13"
    data_13 = 13,
    //% block="14"
    data_14 = 14,
    //% block="15"
    data_15 = 15,
    //% block="16"
    data_16 = 16
}

/**
 *Obloq implementation method.
 */
//% weight=10 color=#008B00 icon="\uf143" block="NFC"
namespace NFC {
    let nfcCallBack: Action = null;
    let reclen = 0;
    let recBuf = pins.createBuffer(25);
    let uid = pins.createBuffer(4);
    let password = pins.createBuffer(6);
    let blockdata = pins.createBuffer(16);
    password[0] = 0xFF;
    password[1] = 0xFF;
    password[2] = 0xFF;
    password[3] = 0xFF;
    password[4] = 0xFF;
    password[5] = 0xFF;
    //% advanced=true shim=NFC::nfcSetTxBufferSize
    function nfcSetTxBufferSize(size: number): void {
        return
    }

    //% advanced=true shim=NFC::nfcSetRxBufferSize
    function nfcSetRxBufferSize(size: number): void {
        return
    }


    //% advanced=true shim=NFC::nfcClearRxBuffer
    function nfcClearRxBuffer(): void {
        return
    }

    //% advanced=true shim=NFC::nfcClearTxBuffer
    function nfcClearTxBuffer(): void {
        return
    }


    //% advanced=true shim=NFC::nfcRxBufferedSize
    function nfcRxBufferedSize(): number {
        return 1
    }

    function wakeup(): void {
        let tempbuf: number[] = [];
        tempbuf = [0x55, 0x55, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xff, 0x03, 0xfd, 0xd4,
            0x14, 0x01, 0x17, 0x00];
        let wake = pins.createBufferFromArray(tempbuf);
        serial.writeBuffer(wake);
        basic.pause(100);
        reclen = nfcRxBufferedSize();
        if (reclen == 15) {
            recBuf = serial.readBuffer(15);
        }
    }

    function checkDCS(x: number): boolean {
        let sum = 0, dcs = 0
        for (let i = 6; i < x - 2; i++)
            sum += recBuf[i]
        dcs = 0xff - sum & 0xff
        if (dcs == recBuf[x - 2])
            return true;
        return false;
    }

    function passWordCheck(block: number, id: Buffer, st: Buffer): boolean {
        let tempbuf: number[] = [];
        tempbuf = [0x00, 0x00, 0xFF, 0x0F, 0xF1, 0xD4, 0x40, 0x01, 0x60, 0x07, 0xFF,
            0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xD1, 0xAA, 0x40, 0xEA, 0xC2, 0x00];
        let cmdPassWord = pins.createBufferFromArray(tempbuf);
        let sum = 0, count = 0;
        cmdPassWord[9] = block;
        for (let i = 10; i < 16; i++)
            cmdPassWord[i] = st[i - 10];
        for (let i = 16; i < 20; i++)
            cmdPassWord[i] = id[i - 16];
        for (let i = 0; i < 20; i++)
            sum += cmdPassWord[i];
        cmdPassWord[20] = 0xff - (sum & 0xff)
        serial.writeBuffer(cmdPassWord);
        basic.pause(100);
        reclen = nfcRxBufferedSize();
        if (reclen == 16) {
            recBuf = serial.readBuffer(reclen);
            if ((checkDCS(16)) && (recBuf[12] == 0x41) && (recBuf[13] == 0x00))
                return true;
        }
        return false;
    }

    //% weight=60
    //% block="Detected card?"
    //% blockId=get_NFC_card
    export function getCard(): boolean {
        nfcSetRxBufferSize(100);
        wakeup();
        let tempbuf: number[] = []
        tempbuf = [0x00, 0x00, 0xFF, 0x04, 0xFC, 0xD4, 0x4A, 0x01, 0x00, 0xE1, 0x00]
        let cmdUID = pins.createBufferFromArray(tempbuf)
        serial.writeBuffer(cmdUID);
        basic.pause(100);
        reclen = nfcRxBufferedSize();
        if (reclen == 25) {
            recBuf = serial.readBuffer(25);
            for (let i = 0; i < 4; i++) {
                uid[i] = recBuf[19 + i];
            }
            if (uid[0] == uid[1] && uid[1] == uid[2] && uid[2] == uid[3] && uid[3] == 0xFF) {
                return false;
            }
            return true;
        }
        return false;
    }

    function sumString(num: number): string {
        let str = "";
        if (num < 0x0A) {
            str += num.toString();
        } else {
            switch (num) {
                case 0x0A:
                    str += "a";
                    break;
                case 0x0B:
                    str += "b";
                    break;
                case 0x0C:
                    str += "c";
                    break;
                case 0x0D:
                    str += "d";
                    break;
                case 0x0E:
                    str += "e";
                    break;
                case 0x0F:
                    str += "f";
                    break;
                default:
                    break;

            }
        }
        return str;
    }

    function numberToString(tempbuf: number[], len: number): string {
        let ret = "";
        let temp = 0;
        for (let i = 0; i < len; i++) {
            temp = (tempbuf[i] & 0xF0) >> 4;
            ret += sumString(temp);
            temp = (tempbuf[i] & 0x0F);
            ret += sumString(temp);
        }
        return ret;
    }
    //% weight=60
    //% block="Read NFC sensor UID data"
    //% blockId=get_UID
    export function getUID(): string {
        nfcSetRxBufferSize(100);
        wakeup();
        let tempbuf: number[] = []
        let retbuf: number[] = []
        tempbuf = [0x00, 0x00, 0xFF, 0x04, 0xFC, 0xD4, 0x4A, 0x01, 0x00, 0xE1, 0x00]
        let cmdUID = pins.createBufferFromArray(tempbuf)
        serial.writeBuffer(cmdUID);
        basic.pause(100);
        reclen = nfcRxBufferedSize();
        if (reclen == 25) {
            recBuf = serial.readBuffer(25);
            for (let i = 0; i < 4; i++) {
                uid[i] = recBuf[19 + i];
            }

            if (uid[0] == uid[1] && uid[1] == uid[2] && uid[2] == uid[3] && uid[3] == 0xFF) {
                return "";
            } else {
                retbuf = [uid[0], uid[1], uid[2], uid[3]];
            }
            return numberToString(retbuf, 4);
        } else {
            return "";
        }
    }

    //% weight=80
    //% block="Did you detect the card UID|%str|?"
    //% blockId=check_UID
    export function checkUID(str: string): boolean {
        if (getUID() == str)
            return true;
        return false;
    }


    //% weight=49
    //% blockId=block_nfc_list block="%blockNum|(data block)"
    export function blockList(blockNum?: DataBlockList): number {
        return blockNum;
    }

    //% weight=49
    //% blockId=data_nfc_list block="%dataNum|(byte)"
    export function nfcDataList(dataNum?: byteNumList): number {
        return dataNum;
    }

    export function testEvent(): void {

    }

    //% weight=90
    //% blockId=nfc_event block="When a card is detected."
    export function nfcEvent(a: Action) {
        nfcCallBack = a;
    }

    function writeblock(blockNum: number, data: Buffer): void {
        if (!passWordCheck(blockNum, uid, password))
            return;
        let cmdWrite: number[] = [0x00, 0x00, 0xff, 0x15, 0xEB, 0xD4, 0x40, 0x01, 0xA0,
            0x06, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07,
            0x08, 0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F, 0xCD,
            0x00];
        let sum = 0, count = 0;
        cmdWrite[9] = blockNum;
        for (let i = 10; i < 26; i++)
            cmdWrite[i] = data[i - 10];
        for (let i = 0; i < 26; i++)
            sum += cmdWrite[i];
        cmdWrite[26] = 0xff - (sum & 0xff);
        let tempbuf = pins.createBufferFromArray(cmdWrite)
        serial.writeBuffer(tempbuf);
        basic.pause(100);
        reclen = nfcRxBufferedSize();
        serial.readBuffer(reclen);
    }

    //% weight=90
    //% blockId=write_nfc_data 
    //% data.min=0 data.max=255
    //% block="NFC sensor data block :|%blockNum=block_nfc_list| byte: %byteNum=data_nfc_list|write%writeIn"
    export function writeData(blockNum: number, index: number, data: number): void {
        if (((blockNum + 1) % 4 == 0) || (blockNum > 63) || (blockNum < 0)) {
            return;
        }
        if (data > 255)
            data = 255;
        if (data < 0)
            data = 0;
        readNFCData(blockNum);
        blockdata[index - 1] = data;
        writeblock(blockNum, blockdata);
    }

    //% weight=60
    //% blockId=read_nfc_data block="Read NFC sensor data block:|%num=block_nfc_list|all data"
    export function readNFCData(num: number): string {
        if (!passWordCheck(num, uid, password))
            return "read error!"
        let cmdRead: number[] = []
        cmdRead = [0x00, 0x00, 0xff, 0x05, 0xfb, 0xD4, 0x40, 0x01, 0x30, 0x07, 0xB4, 0x00];
        let sum = 0, count = 0;
        cmdRead[9] = num;
        for (let i = 0; i < 10; i++)
            sum += cmdRead[i];
        cmdRead[10] = 0xff - sum & 0xff;
        let tempbuf = pins.createBufferFromArray(cmdRead)
        serial.writeBuffer(tempbuf);
        basic.pause(100);
        reclen = nfcRxBufferedSize();
        if (reclen == 32) {
            recBuf = serial.readBuffer(reclen);
        } else {
            return "read timeout";
        }
        if ((checkDCS(32) == true) && (recBuf[12] == 0x41) && recBuf[13] == 0x00) {
            let tempNum: number[] = []
            for (let i = 0; i < 16; i++) {
                blockdata[i] = recBuf[i + 14];
                tempNum[i] = recBuf[i + 14];
            }
            return numberToString(tempNum, 16);
        }
        return "read error";
    }

    //% weight=60
    //% blockId=read_nfc_data_one block="Read NFC sensor data block:|%blockNum=block_nfc_list|in%byteNum=data_nfc_list"
    export function readNFCDataOne(blockNum: number, byteNum: number): number {
        let ret = 0;
        readNFCData(blockNum);
        ret = blockdata[byteNum - 1]
        return ret;
    }


    basic.forever(() => {
        if (nfcCallBack != null) {
            if (getCard()) {
                nfcCallBack();
            }
            basic.pause(100);
        }
    })
} 

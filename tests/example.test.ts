import { getConfigByChainName, getConfigByChainId } from "../src/config";
import { L1ClientRole } from "../src/types";

describe("test get config functions", () => {
    test("test if getConfigByChainName throw error correctly", async () => {
        jest.setTimeout(60000); //1 minute timeout
        try{
            await getConfigByChainName(L1ClientRole.Monitor,"sctestnet");
        }catch(err){
            if (err instanceof Error) {
                expect(err.message).toEqual("chain name is not matched.");
            }else{
                console.log('Unexpected error', err);
            }
        }
    });

    test("test if getConfigByChainName works correctly", async () => {
        jest.setTimeout(60000); //1 minute timeout
        const config = await getConfigByChainName(L1ClientRole.Monitor,"bsctestnet");
        expect(config.deviceId).toEqual("97");
    });

    test("test if getConfigByChainId throw error correctly", async () => {
        jest.setTimeout(60000); //1 minute timeout
        try{
            await getConfigByChainId(L1ClientRole.Monitor,"98");
        }catch(err){
            if (err instanceof Error) {
                expect(err.message).toEqual("chain id is not matched.");
            }else{
                console.log('Unexpected error', err);
            }
        }
    });

    test("test if getConfigByChainId works correctly", async () => {
        jest.setTimeout(60000); //1 minute timeout
        const config = await getConfigByChainId(L1ClientRole.Monitor,"97");
        expect(config.chainName).toEqual("bsctestnet");
    });
});
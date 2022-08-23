declare type legacyMicroserviceInput = {
    body: object;
    params?: object;
    query?: object;
};
declare type legacyFacade = <Input, Output>(callback: Function, experimentName: string, context: object, Ekhomicroservice: string, legacyInput: Input, legacyMicroserviceInput: legacyMicroserviceInput) => Output;
declare type ekhomodule = {
    wrap: legacyFacade;
};
declare const ekhojs: ekhomodule;
export default ekhojs;

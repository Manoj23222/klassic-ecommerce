declare module "paytmchecksum" {
  const PaytmChecksum: {
    generateSignature(
      params: string | Record<string, any>,
      key: string
    ): Promise<string>;

    verifySignature(
      params: string | Record<string, any>,
      key: string,
      checksum: string
    ): Promise<boolean>;
  };

  export default PaytmChecksum;
}

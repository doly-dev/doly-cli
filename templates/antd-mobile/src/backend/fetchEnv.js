const fetchConfig = process.env.FETCH_ENV;

export const IsMock = fetchConfig.isMock;

export const ApiHead = fetchConfig.fetchUrl || [];

export const MockHead = fetchConfig.mockUrl || [];

export const DefaultMockHead = MockHead[0];

export const DefaultApiHead = ApiHead[0];

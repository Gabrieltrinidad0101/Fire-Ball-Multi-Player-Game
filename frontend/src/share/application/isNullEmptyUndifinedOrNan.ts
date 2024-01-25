export const isNullEmptyUndefinedOrNan = (...values: any[])=>{
    return values.some(value => value === null || value === undefined || value === "" || Object.is(value,NaN) )
}
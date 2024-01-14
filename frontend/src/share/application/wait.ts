const wait = async (time: number): Promise<void> => { await new Promise((resolve, _) => setTimeout(resolve, time)) }

export default wait

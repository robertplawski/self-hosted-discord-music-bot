const { pushToQueue, popFromQueue, hasSongQueued, getFromQueue, getQueueForGuild, clearQueue} = require("../../tools/queue")

const MOCK_ID = "dQw4w9WgXcQ"
const MOCK_QUEUE = `ZojJSsYEMMs
kGZDS7raG9o
TQd6JU1apvU
tFrryegP3S0
5j9my8GRRG4
Wv0PrgH6qxU
ujvY2E8OGfw
lHQ4wEY20vo
nKs1UIYJYv8
oUy3n8uZQfA
Zrri_yt0Els
eu4cOXSaWXg
Y-6OpQ_Woso
Qe2yQBMbBpw
RIjRXzcTWkc
W8gi0l-QzdI
6rvoDiR1mac
RtX9lWghazM
xekfR1-JclU
LqurnEFHELU
R9-M2VPl4ug
IC_WDmeJMGk
a_PapgMumMA
AB1PaIhqFO0
HS45noADbkc
1BRLh5P5ul0
PGFMf0zKdqM
Vss6iD5AudM`.split("\n")

test('Pushing song to queue', ()=>{ 
    const guildId = 1
    pushToQueue(MOCK_ID,guildId)
    expect(getFromQueue(guildId)).toStrictEqual(MOCK_ID)
})

test("Popping song from queue", ()=>{
    const guildId = 1
    popFromQueue(guildId)
    expect(getFromQueue(guildId)).toBe(undefined)
})

test("Populating song queue, and then checking it", ()=>{
    const guildId = 2
    MOCK_QUEUE.forEach((id)=> pushToQueue(id, guildId))
    expect(getQueueForGuild(guildId)).toStrictEqual(MOCK_QUEUE)
})


test("Checking if has a song queued (with a full queue)",()=>{
    const guildId = 2
    MOCK_QUEUE.forEach((id)=> pushToQueue(id, guildId))
    expect(hasSongQueued(guildId)).toStrictEqual(true)
})


test("Clearing song queue",()=>{
    const guildId = 2
    clearQueue(guildId)
    expect(getQueueForGuild(guildId)).toStrictEqual([])
})

test("Checking if has a song queued (with a blank queue)",()=>{
    const guildId = 2
    expect(hasSongQueued(guildId)).toStrictEqual(false)
})

import cache, { CacheClass } from 'memory-cache';

export default function SearchCachedData(search_id: number) {
    const dummyData = {
        data: [
            {id: 1, name: "mike"},
            {id: 2, name: "whatever"},
            {id: 3, name: "doesn't matter"},
            {id: 4, name: "dummy"}
        ]
    };

    const memoryCache: CacheClass<string, object> = new cache.Cache();

    let data = memoryCache.get('dummyData');
    let result = null;

    if (!memoryCache.get('dummyData'))
    {
        memoryCache.put('dummyData', dummyData.data);
        data = memoryCache.get('dummyData');
    }

    data.map(item => {
        if (item.id == search_id) {
            result = item.name;
        }
    })

    return result;
}
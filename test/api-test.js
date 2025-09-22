async function testApi() {
    const testIds = [1, 25, 150];

    for (const id of testIds){
        try{
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
            if(!response.ok) throw new Error (`Error ${response.status}`);
            const data = await response.json();
            console.log(`Pokémon #${id}:`, data.name, data.types.map(t => t.type.name));
        } catch (error){
            console.error(`Failed to fetch Pokémon #${id}:`, error)
        }
    }
}

testApi();
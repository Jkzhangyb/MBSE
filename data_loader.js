export async function getData(fileName) {
    try {
        const response = await fetch(`data/${fileName}.json?v=${new Date().getTime()}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Could not fetch ${fileName}:`, error);
        return null;
    }
}

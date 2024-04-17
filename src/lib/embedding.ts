import { OpenAIApi, Configuration } from 'openai-edge'

const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(config);

export async function getEmbeddings(text: string){
    try {
        // Check if the text contains the table format "column name = row value"
        const containsTableFormat = /=/.test(text);

        if (containsTableFormat) {
            // Split the text into rows based on newlines
            const rows = text.split('\n');
            
            // Extract the values of each row and concatenate them into a single string
            const concatenatedRows = rows.map(row => {
                // Split each row into "column name = row value" pairs
                const pairs = row.split(';'); // Assuming ';' separates pairs
                return pairs.map(pair => {
                    const pairComponents = pair.split('=');
                    // Check if the pair has at least two components
                    if (pairComponents.length >= 2) {
                        // Extract the value and trim it
                        return pairComponents[1].trim();
                    } else {
                        // Return an empty string if no value is found
                        return '';
                    }
                }).join(' ');
            });

            // Join all rows into a single string
            const formattedText = concatenatedRows.join('\n');

            // Call the OpenAI embedding API with the formatted text
            const response = await openai.createEmbedding({
                model: "text-embedding-ada-002",
                input: formattedText
            });

            // Extract and return the embedding result
            const result = await response.json()
            return result.data[0].embedding as number[];
        } else {
            // Call the OpenAI embedding API directly with the original text
            const response = await openai.createEmbedding({
                model: "text-embedding-ada-002",
                input: text.replace(/\n/g, " ")
            });

            // Extract and return the embedding result
            const result = await response.json()
            return result.data[0].embedding as number[];
        }
    } catch (error) {
        console.log('error calling openai embedding api', error)
        throw error
    }
}

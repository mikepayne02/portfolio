export default function OpenGraph(heroImage: string) {
	return (
		<div style={{ display: 'flex' }}>
			<h1>{heroImage}</h1>
			{/* <img width={200} height={200} src={`data:image/png;base64, ${heroImage}`} /> */}
		</div>
	)
}

'use client'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { firestore } from '@/firebase'
import { Box, Modal, Typography, Stack, TextField, Button } from '@mui/material'
import {
	collection,
	query,
	getDocs,
	doc,
	getDoc,
	setDoc,
	deleteDoc,
} from 'firebase/firestore'

export default function Home() {
	const [inventory, setInventory] = useState([])
	const [open, setOpen] = useState(false)
	const [addOpen, setAddOpen] = useState(false)
	const [removeOpen, setRemoveOpen] = useState(false)
	const [itemName, setItemName] = useState('')
	const [quantity, setQuantity] = useState(0)
	const [currentItem, setCurrentItem] = useState('')

	const updateInventory = async () => {
		const snapshot = query(collection(firestore, 'inventory'))
		const docs = await getDocs(snapshot)
		const inventoryList = []
		docs.forEach((doc) => {
			inventoryList.push({
				name: doc.id,
				...doc.data(),
			})
		})
		setInventory(inventoryList)
	}

	const removeItem = async (item, quantity) => {
		const docRef = doc(collection(firestore, 'inventory'), item)
		const docSnap = await getDoc(docRef)
		if (docSnap.exists()) {
			const { quantity: currentQuantity } = docSnap.data()
			if (currentQuantity <= quantity) {
				await deleteDoc(docRef)
			} else {
				await setDoc(docRef, { quantity: currentQuantity - quantity })
			}
		}
		await updateInventory()
	}

	const addItem = async (item, quantity) => {
		const docRef = doc(collection(firestore, 'inventory'), item)
		const docSnap = await getDoc(docRef)
		if (docSnap.exists()) {
			const { quantity: currentQuantity } = docSnap.data()
			await setDoc(docRef, { quantity: currentQuantity + quantity })
		} else {
			await setDoc(docRef, { quantity })
		}
		await updateInventory()
	}

	useEffect(() => {
		updateInventory()
	}, [])

	const handleOpen = () => setOpen(true)
	const handleClose = () => setOpen(false)
	const handleAddOpen = (item) => {
		setCurrentItem(item)
		setAddOpen(true)
	}
	const handleAddClose = () => setAddOpen(false)
	const handleRemoveOpen = (item) => {
		setCurrentItem(item)
		setRemoveOpen(true)
	}
	const handleRemoveClose = () => setRemoveOpen(false)

	const InventoryItem = ({ name, quantity }) => (
		<Box
			key={name}
			width="100%"
			minHeight="100px"
			display="flex"
			alignItems="center"
			justifyContent="space-between"
			bgcolor="#f9f9f9"
			padding={2}
			borderRadius={2}
			boxShadow={1}
		>
			<Typography variant="h6" color="#333">
				{name.charAt(0).toUpperCase() + name.slice(1)}
			</Typography>
			<Typography variant="h6" color="#333">
				{quantity}
			</Typography>
			<Box display="flex" gap={1}>
				<Button
					variant="contained"
					color="primary"
					onClick={() => handleAddOpen(name)}
				>
					Add
				</Button>
				<Button
					variant="contained"
					color="secondary"
					onClick={() => handleRemoveOpen(name)}
				>
					Remove
				</Button>
			</Box>
		</Box>
	)

	return (
		<Box
			width="100vw"
			height="100vh"
			display="flex"
			flexDirection="column"
			justifyContent="center"
			alignItems="center"
			gap={2}
			padding={2}
			bgcolor="#f0f0f0"
		>
			<Modal open={open} onClose={handleClose}>
				<Box
					position="absolute"
					top="50%"
					left="50%"
					sx={{
						transform: 'translate(-50%, -50%)',
					}}
					width={400}
					bgcolor="white"
					border="2px solid #333"
					boxShadow={24}
					p={4}
					display="flex"
					flexDirection="column"
					gap={3}
					borderRadius={2}
				>
					<Typography variant="h6">Add Item</Typography>
					<Stack width="100%" direction="row" spacing={2}>
						<TextField
							variant="outlined"
							fullWidth
							value={itemName}
							onChange={(e) => setItemName(e.target.value)}
						/>
						<Button
							variant="contained"
							onClick={() => {
								addItem(itemName, 1)
								setItemName('')
								handleClose()
							}}
						>
							Add
						</Button>
					</Stack>
				</Box>
			</Modal>

			<Modal open={addOpen} onClose={handleAddClose}>
				<Box
					position="absolute"
					top="50%"
					left="50%"
					sx={{
						transform: 'translate(-50%, -50%)',
					}}
					width={400}
					bgcolor="white"
					border="2px solid #333"
					boxShadow={24}
					p={4}
					display="flex"
					flexDirection="column"
					gap={3}
					borderRadius={2}
				>
					<Typography variant="h6">Add Quantity</Typography>
					<Stack width="100%" direction="row" spacing={2}>
						<TextField
							variant="outlined"
							fullWidth
							type="number"
							value={quantity}
							onChange={(e) => setQuantity(Number(e.target.value))}
						/>
						<Button
							variant="contained"
							onClick={() => {
								addItem(currentItem, quantity)
								setQuantity(0)
								handleAddClose()
							}}
						>
							Add
						</Button>
					</Stack>
				</Box>
			</Modal>

			<Modal open={removeOpen} onClose={handleRemoveClose}>
				<Box
					position="absolute"
					top="50%"
					left="50%"
					sx={{
						transform: 'translate(-50%, -50%)',
					}}
					width={400}
					bgcolor="white"
					border="2px solid #333"
					boxShadow={24}
					p={4}
					display="flex"
					flexDirection="column"
					gap={3}
					borderRadius={2}
				>
					<Typography variant="h6">Remove Quantity</Typography>
					<Stack width="100%" direction="row" spacing={2}>
						<TextField
							variant="outlined"
							fullWidth
							type="number"
							value={quantity}
							onChange={(e) => setQuantity(Number(e.target.value))}
						/>
						<Button
							variant="contained"
							onClick={() => {
								removeItem(currentItem, quantity)
								setQuantity(0)
								handleRemoveClose()
							}}
						>
							Remove
						</Button>
					</Stack>
				</Box>
			</Modal>

			<Button variant="contained" onClick={handleOpen}>
				Add New Item
			</Button>
			<Box
				width="800px"
				padding={2}
				bgcolor="#fff"
				borderRadius={2}
				boxShadow={2}
			>
				<Box
					width="100%"
					height="100px"
					bgcolor="#ADD8E6"
					display="flex"
					alignItems="center"
					justifyContent="center"
					borderRadius={2}
					mb={2}
				>
					<Typography variant="h4" color="#333">
						Inventory Items
					</Typography>
				</Box>
				<Stack width="100%" height="300px" spacing={2} overflow="auto">
					{inventory.map(({ name, quantity }) => (
						<InventoryItem key={name} name={name} quantity={quantity} />
					))}
				</Stack>
			</Box>
		</Box>
	)
}

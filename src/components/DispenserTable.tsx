"use client";
import useSWR from 'swr'
import Image from "next/image";
import {DataGrid, GridColDef, GridRenderCellParams} from "@mui/x-data-grid";
import {Box} from "@mui/material";

const fetcher = (url: string | URL | Request) => fetch(url).then(res => res.json())

const columns: GridColDef[] = [
    {field: 'name', headerName: 'Name', flex: 1 },
    {
        field: 'image', headerName: 'Image', minWidth: 250, flex: 1, renderCell: (params: GridRenderCellParams<any, Date>) => {
            return params.value ? (
                <Image src={`/api/photos${params.value}`} width={150} height={150} alt={`photo`} />
            ) : (
                <></>
            );
        },
    },
    {field: 'stemColor', headerName: 'Stem Color', flex: 1},
];

function DispenserTable() {
    const {data, error} = useSWR<{ image: string, name: string, stemColor: string }[]>('/api/dispensers', fetcher)

    if (error) return <div>Failed to load</div>
    if (!data) return <div>Loading...</div>

    return (
        <Box sx={{ width: '100%' }}>
            <DataGrid columns={columns} rows={data} getRowId={(row) => row._id} getRowHeight={() => 'auto'}/>
        </Box>
    )
}

export default DispenserTable

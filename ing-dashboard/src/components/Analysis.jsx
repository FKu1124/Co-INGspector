
import { Table, Pagination, Spinner, Dropdown } from 'flowbite-react';
import { useEffect, useState } from 'react';
import InspectModal from './InspectModal';

const TITLES = [
    "Transaction ID",
    "Timestamp",
    "Bank Org",
    "Account Org",
    "Bank Dest",
    "Account Dest",
    "Amount Received",
    "Receiving Currency",
    "Amount Paid",
    "Payment Currency",
    "Payment Format",
    "Is Laundering"
]

const placeholder = [
    {
        "Timestamp": "",
        "From Bank": 0,
        "Account": "",
        "To Bank": 0,
        "Account.1": "",
        "Amount Received": 0.0,
        "Receiving Currency": "",
        "Amount Paid": 0.0,
        "Payment Currency": "",
        "Payment Format": "",
        "Is Laundering": ""
    }
]

const ELEMS = 30

export default function Analysis({ setNotificationCounter,addToastNotifications }) {

    const [isLoading, setIsLoading] = useState(false)
    const [critTransactions, setCritTransactions] = useState(new Array(10).fill(placeholder))
    const [transactions, setTransactions] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [modelNames, setModelNames] = useState([]);
    const [activeModel, setActiveModel] = useState("NeuralNetFastAI_BAG_L1/040ac038")

    useEffect(() => {
        getData()
        getModelNames()
    }, [])

    const getData = async () => {
        setIsLoading(true)
        const res = await fetch(`http://localhost:8012/getUserTrans`)
        const data = await res.json()
        setTransactions(data)
        setCritTransactions(data.slice(0, ELEMS))
        setIsLoading(false)
    }

    const getModelNames = async () => {
        setIsLoading(true)
        const res = await fetch(`http://localhost:8012/getModelNames`)
        const data = await res.json()
        setModelNames(data)
    }

    const onPageChange = (page) => {
        setCurrentPage(page)
        setCritTransactions(transactions.slice((page - 1) * ELEMS, page * ELEMS))
    }

    const postTransModel = async(trans, index) => {
        const res = await fetch(`http://localhost:8012/postTrans?model_name=${encodeURIComponent(activeModel)}`, {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(trans)
        })
        const data = await res.json()
        setNotificationCounter(data.notifications)
        if(data.pred === "1")
            addToastNotifications("Possibly Fraudulent Transaction Detected!")
    }

    return (
        <div>
            <Table striped>
                <Table.Head>
                    {TITLES.map((title, i) => (
                        <Table.HeadCell key={`header-${i}`}>{title}</Table.HeadCell>
                    ))}
                    <Table.HeadCell>
                        <span className="sr-only">Edit</span>
                    </Table.HeadCell>
                </Table.Head>
                {isLoading ? (
                    <div className="absolute inset-0 flex justify-center items-center bg-slate-500 opacity-50">
                        <Spinner aria-label="Default status example" />
                        <p>Loading...</p>
                    </div>
                ) : <></>}
                <Table.Body className="divide-y z-10">
                    {critTransactions.map((tx, i) => (
                        <Table.Row key={`row-${i}`} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{i + currentPage * ELEMS - ELEMS + 1}</Table.Cell>
                            <Table.Cell>{tx["Timestamp"]}</Table.Cell>
                            <Table.Cell>{tx["From Bank"]}</Table.Cell>
                            <Table.Cell>{tx["Account"]}</Table.Cell>
                            <Table.Cell>{tx["To Bank"]}</Table.Cell>
                            <Table.Cell>{tx["Account.1"]}</Table.Cell>
                            <Table.Cell>{tx["Amount Received"]}</Table.Cell>
                            <Table.Cell>{tx["Receiving Currency"]}</Table.Cell>
                            <Table.Cell>{tx["Amount Paid"]}</Table.Cell>
                            <Table.Cell>{tx["Payment Currency"]}</Table.Cell>
                            <Table.Cell>{tx["Payment Format"]}</Table.Cell>
                            <Table.Cell>{tx["Is Laundering"]}</Table.Cell>
                            <Table.Cell>
                                <a onClick={() => postTransModel(tx, i)} className='font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer'>Submit</a>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
            <div className="flex overflow-x-auto sm:justify-center">
                <Pagination currentPage={currentPage} totalPages={3} onPageChange={onPageChange} showIcons />
            </div>
            <div className="h-5/6">

                <Dropdown label="Select Model for Analysis" placement="right-start">
                    <div className="flex flex-row">
                        <div className="flex-1">
                            {modelNames.slice(0, Math.floor(modelNames.length / 2)).map((name, i) => (
                                <Dropdown.Item onClick={() => setActiveModel(name)} key={`modelName1-${i}`}>{name}</Dropdown.Item>
                            ))}
                        </div>
                        <div className="flex-1">
                            {modelNames.slice(modelNames.length / 2).map((name, i) => (
                                <Dropdown.Item onClick={() => setActiveModel(name)} key={`modelName2-${i}`}>{name}</Dropdown.Item>
                            ))}
                        </div>
                    </div>
                </Dropdown>
            </div>


        </div>
    );
}

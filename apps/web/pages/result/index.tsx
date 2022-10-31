import {
  Button,
  Col,
  Divider,
  Input,
  Row,
  Space,
  Table,
  Typography,
  Image,
} from 'antd';
import { useEffect, useRef, useState } from 'react';
import mockData from '../../mocks/data_hsv.json';
import _ from 'lodash';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import type { InputRef } from 'antd';
import { ColumnType, FilterConfirmProps } from 'antd/lib/table/interface';
import Highlighter from 'react-highlight-words';

const { Paragraph } = Typography;

interface DataType {
  key: string;
  id_doituong: string;
  pant: string;
  shirt: string;
  shoe: string;
  skirt: string;
  hat: string;
  frame_id: string;
}

type DataIndex = keyof DataType;

const Result = () => {
  const [data, setData] = useState([]);

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): ColumnType<DataType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <>
          <span className="color-block"></span>
          <Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ''}
          />
        </>
      ) : (
        <>
          <span className="color-block"></span>
          <span>{text}</span>
        </>
      ),
  });

  const columns: any[] = [
    {
      title: 'id',
      dataIndex: 'id_doituong',
    },
    {
      title: 'pant',
      dataIndex: 'pant',
      ...getColumnSearchProps('pant'),
    },
    {
      title: 'shirt',
      dataIndex: 'shirt',
      ...getColumnSearchProps('shirt'),
    },
    {
      title: 'shoe',
      dataIndex: 'shoe',
      ...getColumnSearchProps('shoe'),
    },
    {
      title: 'skirt',
      dataIndex: 'skirt',
      ...getColumnSearchProps('skirt'),
    },
    {
      title: 'hat',
      dataIndex: 'hat',
      ...getColumnSearchProps('hat'),
    },
    {
      title: 'frame_id',
      dataIndex: 'frame_id',
      width: '600px',
      render: (values, record) => {
        const imgs = values.map((frameId, index) => {
          return (
            <Image
              src={`/api/frame/${record.id_doituong}?frame=${frameId}`}
              alt={frameId}
              placeholder={<Image preview={false} src="/images/logo.png" />}
              preview={{
                mask:
                  values.length > 3 ? (
                    <EyeOutlined />
                  ) : (
                    <span>+{values.length - 3}</span>
                  ),
              }}
              style={{ height: 60, maxWidth: 100 }}
              hidden={index >= 3}
              key={record.id + '-' + index}
            />
          );
        });
        return <Image.PreviewGroup>{imgs}</Image.PreviewGroup>;
        // return (
        //   <Paragraph
        //     ellipsis={{
        //       expandable: true,
        //       rows: 2,
        //       symbol: <>Xem</>,
        //     }}
        //   >
        //     {values.join(', ')}
        //   </Paragraph>
        // );
      },
    },
  ];

  const fetchData = async () => {
    return await new Promise((resolve, reject) => {
      fetch('/api/result')
        .then((res) => {
          if (res.status !== 200) {
            reject(res.statusText);
          }
          res.json().then((value) => {
            console.log('success', value);
            setData(value);
            resolve(true);
          });
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div>
      <Row>
        <Col></Col>
      </Row>
      <Divider />
      <div>
        <Table
          bordered
          dataSource={data}
          columns={columns}
          rowKey="id_doituong"
          size="small"
        />
      </div>
    </div>
  );
};

export default Result;

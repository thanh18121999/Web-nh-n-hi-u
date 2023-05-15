import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Space,
  Form,
  Input,
  Popconfirm,
  TreeSelect,
  Select,
  DatePicker,
  TimePicker,
  message,
} from "antd";
import { UpdateBooking, SendEmail } from "../Service";

const format = "HH:mm";

const EditBooking = ({ onCancel, value, dataToUpdate }) => {
  const { TextArea } = Input;
  const [form] = Form.useForm();
  const [dataEdit, setDataEdit] = useState({
    id: dataToUpdate.id,
    datetimebooK1: dataToUpdate.datetimebooK1,
    datetimebooK2: dataToUpdate.datetimebooK2,
  });
  const [dataConfirm, setDataConfirm] = useState({
    dateConfirm: "",
    timeConfirm: "",
    duration: 120,
    updatenote: "",
  });
  useEffect(() => {
    setDataEdit(dataToUpdate);
  }, [dataToUpdate]);
  // useEffect(() => {
  //   form.setFieldsValue({ title: dataEdit.title });
  // }, [dataEdit]);

  const [visible, setVisible] = useState(false);

  const showPopconfirm = () => {
    if (visible == false) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  };
  const cancel = (e) => {
    setVisible(false);
  };
  const handleEditBooking = async () => {
    if (!dataConfirm.dateConfirm) {
      message.error("Ngày hẹn không được trống");
    } else if (!dataConfirm.timeConfirm) {
      message.error("Giờ hẹn không được trống");
    } else if (!dataConfirm.duration) {
      message.error("Thời lượng buổi hẹn không được trống");
    } else if (!dataConfirm.updatenote) {
      message.error("Nội dung cập nhật không được trống");
    } else {
      let res = UpdateBooking(
        dataEdit.id,
        dataConfirm.dateConfirm + "T" + dataConfirm.timeConfirm + ":00.000",
        dataConfirm.duration,
        dataConfirm.updatenote,
        onCancel
      );
      if ((res.statuscode = 200)) {
        if (dataEdit.status == "Mới tạo") {
          var subjectemail = "Chốt thời gian hẹn";
          var bodyemail =
            "Lịch hẹn của anh/chị đã được chốt thời gian vào ngày " +
            dataConfirm.dateConfirm +
            " lúc " +
            dataConfirm.timeConfirm +
            ", buổi hẹn sẽ diễn ra trong vòng " +
            dataConfirm.duration +
            " phút.";
          let mailResult = SendEmail(
            dataEdit.customemail,
            subjectemail,
            bodyemail
          );
          if ((mailResult.statuscode = 200)) {
            setVisible(false);
            message.success("Cập nhật lịch hẹn thành công");
          }
        } else if (
          dataEdit.status == "Đã chốt ngày giờ hẹn" ||
          dataEdit.status == "Đã dời lịch"
        ) {
          var subjectemail = "Dời lịch hẹn";
          var bodyemail =
            "Thân gửi anh/chị " +
            dataEdit.customname +
            ",\r\n\r\n" +
            "Lịch hẹn của anh/chị đã được dời thành công.\r\n\r\n" +
            "Ngày hẹn: " +
            dataConfirm.dateConfirm +
            ".\r\n" +
            "Thời gian hẹn: " +
            dataConfirm.timeConfirm +
            ".\r\n" +
            "Thời lượng buổi hẹn: " +
            dataConfirm.duration +
            " phút.\r\n" +
            "Địa điểm hẹn: " +
            dataEdit.addressbook +
            ".\r\n\r\n" +
            "Trân trọng,\r\n" +
            "Công ty Phúc Khang Net.\r\n" +
            "-----------------------\r\n" +
            "Đây là thư trả lời tự động. Vui lòng không phản hồi.\r\nCảm  ơn./.";

          console.log(bodyemail, "bd");
          let mailResult = SendEmail(
            dataEdit.customemail,
            subjectemail,
            bodyemail
          );
          if ((mailResult.statuscode = 200)) {
            setVisible(false);
            message.success("Cập nhật lịch hẹn thành công");
          }
        }
      } else {
        setVisible(false);
        message.error("Cập nhật lịch hẹn thất bại");
      }
    }
  };
  const onChangeDate = (date, dateString) => {
    setDataConfirm({ ...dataConfirm, dateConfirm: dateString });
  };
  const onChangeTime = (time, timeString) => {
    setDataConfirm({ ...dataConfirm, timeConfirm: timeString });
  };
  return (
    <>
      <div className="edit-group">
        <Form layout="vertical" name="control-hooks" form={form}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Form.Item
              label="Chọn ngày hẹn"
              name="date"
              rules={[
                {
                  required: true,
                  message: "Ngày hẹn không được trống!",
                },
              ]}
            >
              <DatePicker
                onChange={onChangeDate}
                disabledDate={(d) =>
                  !d ||
                  d.isAfter(dataEdit.datetimebooK2) ||
                  d.isBefore(dataEdit.datetimebooK1)
                }
                style={{ width: "22rem" }}
              />
            </Form.Item>
            {!dataConfirm.dateConfirm ? null : (
              <Form.Item
                label="Chọn giờ hẹn"
                name="time"
                rules={[
                  {
                    required: true,
                    message: "Giờ hẹn không được trống!",
                  },
                ]}
                style={{ display: "flex" }}
              >
                <TimePicker
                  onChange={onChangeTime}
                  format={format}
                  style={{ width: "22rem" }}
                />
              </Form.Item>
            )}
          </div>
          <Form.Item
            label="Chọn thời lượng cuộc hẹn"
            name="duration"
            rules={[
              {
                required: true,
                message: "Thời lượng hẹn không được trống!",
              },
            ]}
          >
            <Select
              style={{ width: "100%" }}
              placeholder="Chọn thời lượng cuộc hẹn"
              defaultValue={"120"}
              options={[
                { value: "30", label: "30 phút" },
                { value: "60", label: "60 phút" },
                { value: "90", label: "90 phút" },
                { value: "120", label: "120 phút" },
                { value: "150", label: "150 phút" },
                { value: "180", label: "180 phút" },
              ]}
              onChange={(e) => setDataConfirm({ ...dataConfirm, duration: e })}
            />
          </Form.Item>
          <Form.Item label="Ghi chú" name="updatenote">
            <TextArea
              rows={4}
              placeholder="Nội dung cập nhật: Chốt ngày hẹn/Dời lịch lần thứ n"
              onChange={(e) =>
                setDataConfirm({ ...dataConfirm, updatenote: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item>
            <Space
              style={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Button type="primary" onClick={onCancel}>
                Hủy
              </Button>
              <Popconfirm
                title="Xác nhận chỉnh sửa?"
                onConfirm={handleEditBooking}
                onCancel={cancel}
                okText="Xác nhận"
                cancelText="Hủy"
                visible={visible}
              >
                <Button type="primary" onClick={showPopconfirm}>
                  Cập nhật
                </Button>
              </Popconfirm>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default EditBooking;

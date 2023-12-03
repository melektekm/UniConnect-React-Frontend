// Material Dashboard 2 React components
import React from "react";
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import MDAvatar from "../../../components/MDAvatar";
import MDBadge from "../../../components/MDBadge";

// Images
import team2 from "../../../assets/images/team-2.jpg";
import team3 from "../../../assets/images/team-3.jpg";
import team4 from "../../../assets/images/team-4.jpg";

export default function data() {
  const Author = ({ image, name, email }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption">{email}</MDTypography>
      </MDBox>
    </MDBox>
  );

  const Job = ({ title, description }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography
        display="block"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {title}
      </MDTypography>
      <MDTypography variant="caption">{description}</MDTypography>
    </MDBox>
  );

  const FoodItem = ({ drink, description }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography
        display="block"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {description}
      </MDTypography>
      <MDTypography
        display="block"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {drink}
      </MDTypography>
    </MDBox>
  );

  return {
    columns: [
      {
        Header: "Employees",
        accessor: "employees",
        width: "45%",
        align: "left",
      },
      {
        Header: "Ordered Food item",
        accessor: "Ordered_Food_item",
        width: "45%",
        align: "left",
      },
      { Header: "position", accessor: "function", align: "left" },
      { Header: "status", accessor: "status", align: "center" },
      { Header: "date", accessor: "date", align: "center" },
    ],

    rows: [
      {
        employees: (
          <Author
            image={team2}
            name="Alemu kebede"
            email="john@creative-tim.com"
          />
        ),
        Ordered_Food_item: <FoodItem description="1 shero" drink="2 Tea" />,
        function: <Job title="Manager" description="Organization" />,
        status: (
          <MDBox ml={-1}>
            <MDBadge
              badgeContent="Paid"
              color="success"
              variant="gradient"
              size="sm"
            />
          </MDBox>
        ),
        date: (
          <MDTypography
            component="a"
            href="#"
            variant="caption"
            color="text"
            fontWeight="medium"
          >
            23/04/18
          </MDTypography>
        ),
      },
      {
        employees: (
          <Author
            image={team3}
            name="Dnberu solomon"
            email="dnberu@creative-tim.com"
          />
        ),
        Ordered_Food_item: <FoodItem description="1 Firfir" drink="2 Coffee" />,
        function: <Job title="Programator" description="Developer" />,
        status: (
          <MDBox ml={-1}>
            <MDBadge
              badgeContent="Paid"
              color="success"
              variant="gradient"
              size="sm"
            />
          </MDBox>
        ),
        employed: (
          <MDTypography
            component="a"
            href="#"
            variant="caption"
            color="text"
            fontWeight="medium"
          >
            11/01/19
          </MDTypography>
        ),
        action: (
          <MDTypography
            component="a"
            href="#"
            variant="caption"
            color="text"
            fontWeight="medium"
          >
            Edit
          </MDTypography>
        ),
      },
      {
        employees: (
          <Author
            image={team4}
            name="Ayana jemal"
            email="laurent@creative-tim.com"
          />
        ),
        Ordered_Food_item: (
          <FoodItem description="1 Be Aynetu" drink="1 coffee and 1 Tea" />
        ),
        function: <Job title="Executive" description="Projects" />,
        status: (
          <MDBox ml={-1}>
            <MDBadge
              badgeContent="Paid"
              color="success"
              variant="gradient"
              size="sm"
            />
          </MDBox>
        ),
        employed: (
          <MDTypography
            component="a"
            href="#"
            variant="caption"
            color="text"
            fontWeight="medium"
          >
            19/09/17
          </MDTypography>
        ),
        action: (
          <MDTypography
            component="a"
            href="#"
            variant="caption"
            color="text"
            fontWeight="medium"
          >
            Edit
          </MDTypography>
        ),
      },
      {
        employees: (
          <Author
            image={team3}
            name="Hermela tilahun"
            email="michael@creative-tim.com"
          />
        ),
        Ordered_Food_item: (
          <FoodItem description="1 Be Aynetu" drink="2 Milk" />
        ),
        function: <Job title="Programator" description="Developer" />,
        status: (
          <MDBox ml={-1}>
            <MDBadge
              badgeContent="Paid"
              color="success"
              variant="gradient"
              size="sm"
            />
          </MDBox>
        ),
        employed: (
          <MDTypography
            component="a"
            href="#"
            variant="caption"
            color="text"
            fontWeight="medium"
          >
            24/12/08
          </MDTypography>
        ),
        action: (
          <MDTypography
            component="a"
            href="#"
            variant="caption"
            color="text"
            fontWeight="medium"
          >
            Edit
          </MDTypography>
        ),
      },
      {
        employees: (
          <Author
            image={team3}
            name="Abebe chala"
            email="richard@creative-tim.com"
          />
        ),
        Ordered_Food_item: <FoodItem description="1 Tibs" drink="2 Milk" />,
        function: <Job title="Manager" description="Executive" />,
        status: (
          <MDBox ml={-1}>
            <MDBadge
              badgeContent="Paid"
              color="success"
              variant="gradient"
              size="sm"
            />
          </MDBox>
        ),
        employed: (
          <MDTypography
            component="a"
            href="#"
            variant="caption"
            color="text"
            fontWeight="medium"
          >
            04/10/21
          </MDTypography>
        ),
        action: (
          <MDTypography
            component="a"
            href="#"
            variant="caption"
            color="text"
            fontWeight="medium"
          >
            Edit
          </MDTypography>
        ),
      },
      {
        employees: (
          <Author
            image={team4}
            name="Meskerem alemu"
            email="miriam@creative-tim.com"
          />
        ),
        Ordered_Food_item: <FoodItem description="1 Dulet" drink="2 Coffee" />,
        function: <Job title="Programator" description="Developer" />,
        status: (
          <MDBox ml={-1}>
            <MDBadge
              badgeContent="Paid"
              color="success"
              variant="gradient"
              size="sm"
            />
          </MDBox>
        ),
        employed: (
          <MDTypography
            component="a"
            href="#"
            variant="caption"
            color="text"
            fontWeight="medium"
          >
            14/09/20
          </MDTypography>
        ),
        action: (
          <MDTypography
            component="a"
            href="#"
            variant="caption"
            color="text"
            fontWeight="medium"
          >
            Edit
          </MDTypography>
        ),
      },
    ],
  };
}
